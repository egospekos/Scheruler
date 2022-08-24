let day = 16;
    let base;
    let teams;
    
    $(function () {
        base = createBase();
        reloadSchedule();
        getTeams();

        //setInterval(showBase, 5000);

    })

    function showBase() {
        console.log(base);
    }

    function createBase() {
        let baseJSON = {};
        baseJSON.header = ["PT", "SA", "ÇA", "PE", "CU", "CT", "PA", "PT", "SA", "ÇA", "PE", "CU", "CT", "PA", "PT", "SA", "ÇA", "PE", "CU", "CT", "PA", "PT", "SA", "ÇA", "PE", "CU", "CT", "PA", "PT", "SA"];
        baseJSON.rows = [];
        baseJSON.rows.push([[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],]);
        baseJSON.rows.push([[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],]);
        baseJSON.rows.push([[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],]);
        return baseJSON;
    }

    function dayClickListener(dayP) {
        jdayP = $(dayP);
        jdaydiv = jdayP.parent();
        let coordinates = getCoordinatesFromDiv(jdaydiv);

        let data = getDataFromDiv(jdaydiv);
        console.log(data);
        let next = getNextTeam(data, coordinates);
        //syncBase(coordinates, next);
        arrangeDivCSS(jdaydiv, next);
    }

    function syncBase(coordinates, data) {
        if (data == "null") {
            delete base.rows[coordinates.x][coordinates.y][coordinates.z];
        }
        base.rows[(coordinates.x)][(coordinates.y)][coordinates.z] = data;
    }

    function getCoordinatesFromDiv(div) {
        let x, y, z;
        x = Number(div.attr("data-x"));
        y = Number(div.attr("data-y"));
        z = Number(div.attr("data-z"));
        return { x: x, y: y, z: z };
    }

    function arrangeDivCSS(cell, data) {
        if (data == "A") {
            cell.css("background-color", "#e41a1c");
            cell.attr("data-team", "A");
            setDivTooltip(cell, "A");
        }
        else if (data == "B") {
            cell.css("background-color", "#377eb8");
            cell.attr("data-team", "B");
            setDivTooltip(cell, "B");
        }
        else if (data == "C") {
            cell.css("background-color", "#4daf4a");
            cell.attr("data-team", "C");
            setDivTooltip(cell, "C");
        }
        else if (data == "D") {
            cell.css("background-color", "#984ea3");
            cell.attr("data-team", "D");
            setDivTooltip(cell, "D");
        }
        else if (data == "E") {
            cell.css("background-color", "#ff7f00");
            cell.attr("data-team", "E");
            setDivTooltip(cell, "E");
        }
        else if (data == "F") {
            cell.css("background-color", "#ffff33");
            cell.attr("data-team", "F");
            setDivTooltip(cell, "F");
        }
        else if (data == "G") {
            cell.css("background-color", "#f781bf");
            cell.attr("data-team", "G");
            setDivTooltip(cell, "G");
        }
        else if (data == "H") {
            cell.css("background-color", "#a65628");
            cell.attr("data-team", "H");
            setDivTooltip(cell, "H");
        }
        else {
            cell.css("background-color", "#ffffff");
            // null için data team 
            setDivTooltip(cell, "");
        }
        setDataInDiv(cell, data);
        //cell.text(data);
    }
    function generateHeader(obj) {
        $("#theader").append(`<th class='headerBox cornerBox dateText'><p class="boxText dateText">DATE</p></th>`);
        for (let i = 0; i < obj.length; i++) {
            $("#theader").append(`
                                <th class='headerBox'>
                                    <p class="boxText dateText">${i+1}</p>
                                </th>`);
        }
        $("#tbody").append(`<th class='dayBox'><p class="boxText">DAY</p></th>`);
        for (let i = 0; i < obj.length; i++) {
            $("#tbody").append(`
                                <th id="day${i}" class='dayBox'>
                                    <p class="boxText">${obj[i]}</p>
                                </th>`);
        }
    }
    function generateBody(obj) {
        let shift;
        for (let i = 0; i < obj.length; i++) {
            $("#tbody").append(`
            <tr
            id="shift${i}depth0"
            class="mainRow"
            data-shift=${i}
            data-depth=0
            ></tr>
                `);
            shift = $(`#shift${i}depth0`);
            generateHeadCell(shift, "SHIFT");
            fillDummyShift(shift);
            
            generateSeparator();
        }
        fillSeparators();
    }

    function importJSON(obj) {
        //reloadSchedule(); 1-6
        //resetTable();
        setInfo(obj.metaData);
        setDays(obj.header);
        let data, cell, shiftRow, upperRow;
        for (let x = 0; x < obj.rows.length; x++) {
            for (let y = 0; y < obj.rows[x].length; y++) {
                data = obj.rows[x][y];
                for (let z = 0; z < data.length; z++) {
                    shiftRow = $(`#shift${x}depth${z}`);
                    if (!shiftRow.length) {
                        upperRow = $(`#shift${x}depth${z - 1}`);
                        if (upperRow.length) {
                            insertRow(upperRow);
                        }
                    }
                    // günün celli 1 y eksik - 0dan başlıyo
                    pushDataTo({ x: x, y: y, z: z }, data[z]);
                }
            }
        }
        //setTeamsTooltip();
    }

    function setDays(obj){
        for (let i = 0; i < obj.length; i++) {
            $(`#day${i}`).find("p").text(obj[i]);
        }
    }

    function generateSeparator() {
        let separator = $("#tbody").append($(`<tr
        class="seperator"
        ></tr>`));
    }

    function fillSeparators() {
        separators = $(".seperator");
        for (let i = 0; i < separators.length; i++) {
            for (let y = 0; y < base.header.length+1; y++) {
                $(separators[i]).append(`<td><div class="seperatorBox"</div></td>`);
            }
        }
    }

    function generateHeadCell(shift, name,button=false) {
        shift.append(`
        <td>
            <div class="firstBox">
                <p class="firstBoxText">${name}</p>
                ${getHeadButtonDiv(button)}
            </div>
        </td>`);
    }

    function setInfo(data) {
        $("#creauser").text(data.creauser);
        $("#creadate").text(data.creadate);
        $("#approve").text(data.approve);
        $("#title").text(data.title);
        $("#month").text(data.month);
    }

    function pushDataTo(coordinates, data) {
        cell = $(`#x${(coordinates.x)}y${coordinates.y}z${coordinates.z}`);

        if (cell.length) {
            // burada data ile alakalı kontroller. aynı shiftte var mı
            arrangeDivCSS(cell, data);
            //if(sync) syncBase(coordinates,data);
        }
    }

    // function setData(cell,data){
    //     // burada datayı eklerken hangi tipse ona göre renk , array sync
    //     cell.text(data);
    // }

    function insertRow(upperRow) {
        // yollanan rowun altına bi row ekleyip null doldururur
        //setRowMetaData(upperRow);
        let shiftRow = getInserted(upperRow);
        generateHeadCell(shiftRow, "",true);
        fillDummyShift(shiftRow);
        return shiftRow;
    }

    //function setRowMetaData(upperRow) {
    //    let _upperRow = upperRow
    //    let rowAfter;

    //    while (true) {
    //        rowAfter = getRowAfter(_upperRow);
    //        metaData = getShiftHeadData(rowAfter);
    //        rowAfter.prop("id", `shift${metaData.shiftNo}depth${(metaData.shiftDepth + 1)}`)
    //        if (!rowAfter.length) return;
    //        _upperRow = rowAfter;
    //    }
    //}

    function getRowAfter(row) {

        metaData = getShiftHeadData(row);
        return $(`#shift${metaData.shiftNo}depth${metaData.shiftDepth + 1}`);
    }
    // function getInserted(beforeRow,shiftNo,shiftDepth){
    //     shiftID = `shift${shiftNo}depth${shiftDepth}`;
    //     $(`
    //     <tr id="${shiftID}" class="additionalRow"></tr>`).insertAfter(beforeRow);
    //     return $("#"+shiftID);
    // }

    function getInserted(upperRow) {
        shift = getShiftHeadData(upperRow);
        shiftID = `shift${shift.shiftNo}depth${shift.shiftDepth + 1}`;
        $(`<tr id="${shiftID}"
        class="additionalRow"
        data-shift=${shift.shiftNo}
        data-depth=${(shift.shiftDepth + 1)}
        ></tr>`).insertAfter(upperRow);
        return $("#" + shiftID);
    }




    function fillDummyShift(shift) {
        shiftData = getShiftHeadData(shift);
        // ilk data için ekleme yok
        for (let y = 0; y < base.header.length; y++) {
            shift.append(`
            <td>
                <div
                class="dataBox innerBox"
                id="x${(shiftData.shiftNo)}y${y}z${shiftData.shiftDepth}"
                data-x=${(shiftData.shiftNo)}
                data-y=${y}
                data-z=${(shiftData.shiftDepth)}
                data-team="A">
                    <p onclick="dayClickListener(this)" class="boxText" style="margin-top:0px;margin-bottom:0px;"></p>
                    <div class="boxButtons">
                        <i onclick="DeleteCell(this)" class="fa fa-trash" aria-hidden="true"></i>
                        <i onclick="AddInRow(this,2)" class="fa fa-plus" aria-hidden="true"></i>
                        <i onclick="AddInRow(this,5)" class="fa fa-plus-square" aria-hidden="true"></i>
                    </div>
                </div>
            </td>
            `);
        }

    }

   

    function AddInRow(span, count) {
        //index taşıyor mu kontrol gelecek
        currentDiv = getButtonDiv(span);
        let coordinates = getCoordinatesFromDiv(currentDiv);
        let data = getDataFromDiv(currentDiv);
        let nearDiv;
        for (let i = 1; i < count + 1; i++) {
            //syncBase({ x: (coordinates.x), y: (coordinates.y + i), z: (coordinates.z) }, data);
            nearDiv = $(`#x${(coordinates.x)}y${coordinates.y + i}z${coordinates.z}`);
            arrangeDivCSS(nearDiv, data);
        }
    }

    function DeleteCell(i) {
        currentDiv = getButtonDiv(i);
        clear(currentDiv);
    }

    function clear(div) {
        let coordinates = getCoordinatesFromDiv(div);
        //syncBase(coordinates, "null");
        arrangeDivCSS(div, "");
    }

    // if cell div changes change these too
    function getDataFromDiv(div) { return div.find("p").text(); }
    function setDataInDiv(div, data) { div.find("p").text(data); }
    function getButtonDiv(i) { return $(i).parent().parent(); }
    function getShiftHeadData(row) {return {shiftNo: Number(row.attr("data-shift")), shiftDepth: Number(row.attr("data-depth")) }}
    function getRowFirstBox(row) {return row.find(".firstBox");}
    function getRowAllBox(row) { return row.find(".dataBox"); }
    function getHeadButtonDiv( deleteButton = false){
         return `<div class="headButtonDiv">
                 <i onclick="expandShift(this)" class="fa fa-plus-square-o" aria-hidden="true"></i>
                 ${deleteButton ? "<i onclick='collapseShift(this)' class='fa fa-minus-square-o' aria-hidden='true'></i>":""}
                 </div> `;
    }

    function TEST_IT() {
        let monthJSON = {};
        monthJSON.metaData = {
            "title": "BOPET ÜRETİM HATLARI (Formen&Operatör) VARDİYA LİSTESİ (POLİNAS-2)",
            "creauser": "kullanıcı",
            "month": "HAZİRAN 2022",
            "creadate": "13.12.2022",
            "approve": "onay"
        };
        monthJSON.header = ["ÇA", "PE", "CU", "CT", "PA", "PT", "SA", "ÇA", "PE", "CU", "CT", "PA", "PT", "SA", "ÇA", "PE", "CU", "CT", "PA", "PT", "SA", "ÇA", "PE", "CU", "CT", "PA", "PT", "SA", "ÇA", "PE"]
        monthJSON.rows = [];
        monthJSON.rows.push([["A", "B", "C"], ["A", "B", "C"], ["A", "D"], ["A"], ["A"], ["A"], ["A"], ["C"], ["A"], ["A", "B"], ["A", "B"], ["A", "B"], ["A"], ["A", "E"], ["A", "H"], ["A", "B", "C"], ["A", "B", "C"], ["A"], ["A"], ["A"], ["A", "E"], ["A", "F"], ["C"], ["A"], ["A", "B"], ["A", "B"], ["A", "B"], ["A"], ["A","F"], ["A"]]);
        monthJSON.rows.push([["C"], ["F"], ["C"], ["C"], ["C", "B"], ["C"], ["C"], ["C"], ["C"], ["C", "H"], ["C"], ["C"], ["C", "G"], ["C", "G"], ["C"], ["A", "B", "C"], ["A", "B", "C"], ["A"], ["A"], ["A"], ["A"], ["A","D"], ["C"], ["A"], ["A", "B"], ["A", "B"], ["A", "B"], ["A"], ["A"], ["A","G"]]);
        monthJSON.rows.push([["C"], [], ["C"], ["C"], ["C", "B"], ["C", "D"], ["C"], ["C"], ["C"], ["C"], ["C"], ["C"], ["C"], ["C", "H"], ["C", "H"], ["C", "H"], [], ["C"], ["C", "E"], ["C", "B"], ["C"], ["C"], ["C"], ["C"], ["C"], ["C"], ["C"], ["C"], ["C"], ["C"],]);
        base = monthJSON;
        //reloadSchedule();
        importJSON(base);
    }

    function reloadSchedule() {
        // table divi boşaltılacak
        resetTable();
        generateHeader(base.header);
        generateBody(base.rows);
    }

    function resetTable() {
        $("#theader").empty();
        $("#tbody").empty();
    }

    function getTeams() {
        // get teams post içinde
        teams = [
            { "name": "A", "members": ["user 1,user 2"] },
            { "name": "B", "members": ["user 3,user 4"] },
            { "name": "C", "members": ["user 5,user 6"] },
            { "name": "D", "members": ["user 7,user 8"] },
            { "name": "E", "members": ["user 9,user 10"] },
            { "name": "F", "members": ["user 11,user 12"] },
            { "name": "G", "members": ["user 13,user 14"] },
            { "name": "H", "members": ["user 15,user 16"] }];
     
        
    }

    function setTeamsTooltip() {
        for (let i = 0; i < teams.length; i++) {
            tooltipText = "";
            teamName = teams[i].name;
            for (let j = 0; j < teams[i].members.length; j++) {
                tooltipText += teams[i].members[j];
            }
            
            //$("[data-team='A']").tooltip({
            //    "title": tooltipText,
            //    "placement": "bottom"
            //});
            $(`[data-team="${teamName}"]`).tooltip({
            "title": tooltipText,
            "placement": "bottom"
            });
        }
    }

    function setDivTooltip(cell, teamname) {
        let tooltipText = "";
        if (teamname == "") {
            cell.tooltip({
                "title": "",
                "placement": "bottom"
            });
        }
        else {
            for (let i = 0; i < teams.length; i++) {
                if (teamname == teams[i].name) {
                    for (let j = 0; j < teams[i].members.length; j++) {
                        tooltipText += teams[i].members[j];
                    }

                }
                cell.tooltip({
                    "title": tooltipText,
                    "placement": "bottom"
                });
            }
        }
        
    }

    function getNextTeam(data, coordinates) {
        // coordinate ile altındaki elemanlara gitmeyebilir
        if (data == "") {
            let leftBox = $(`#x${coordinates.x}y${coordinates.y-1}z${coordinates.z}`);
            if (leftBox.length) return leftBox.attr("data-team");
            else return teams[0].name;
        }
        for (let i = 0; i < teams.length; i++) {
            if (teams[i].name == data) return teams[(i + 1) % teams.length].name;
        }
    }

    function addRowButton(span) {
        insertRow($(span).parent().parent().parent().parent());
    }

    function deleteRowButton(span) {
    }

    function expandShift(span) {
        _shift = $(span).parent().parent().parent().parent();
        rows = getFollowingRows(_shift);
        for (let i = 0; i < rows.length; i++) {
            rows[i].attr("data-depth", Number(rows[i].attr("data-depth")) + 1);
            rows[i].attr("id", `shift${rows[i].attr("data-shift")}depth${rows[i].attr("data-depth")}`);
            boxes = getRowAllBox(rows[i]);
            for (let j = 0; j < boxes.length; j++) {
                $(boxes[j]).attr("data-z", Number($(boxes[j]).attr("data-z")) + 1);
                $(boxes[j]).attr("id", `x${$(boxes[j]).attr("data-x")}y${$(boxes[j]).attr("data-y")}z${$(boxes[j]).attr("data-z")}`);
            }            
        }
        insertRow(_shift);
    }

    function collapseShift(span) {
        _shift = $(span).parent().parent().parent().parent();
        rows = getFollowingRows(_shift);
        for (let i = 0; i < rows.length; i++) {
            rows[i].attr("data-depth", Number(rows[i].attr("data-depth")) - 1);
            rows[i].attr("id", `shift${rows[i].attr("data-shift")}depth${rows[i].attr("data-depth")}`);
            boxes = getRowAllBox(rows[i]);
            for (let j = 0; j < boxes.length; j++) {
                $(boxes[j]).attr("data-z", Number($(boxes[j]).attr("data-z")) - 1);
                $(boxes[j]).attr("id", `x${$(boxes[j]).attr("data-x")}y${$(boxes[j]).attr("data-y")}z${$(boxes[j]).attr("data-z")}`);
            }
        }
        _shift.remove();
    }

    function getAllFollowingRows(_row) {
        // tablo sonuna kadar tüm rowlar
        head = getShiftHeadData(_row);
        let j = 0;
        let rows = [];
        let firstDepth = head.shiftDepth;
        while (true) {
            let i = 1;
            if (_row.length) {
                while (true) {
                    row = $(`#shift${head.shiftNo + j}depth${(firstDepth + i)}`);
                    i++;
                    if (row.length) {
                        rows.push(row);
                    } else {break;}
                }
                firstDepth = 0;
                j++;
                _row = $(`#shift${head.shiftNo + j}depth${(0)}`);
                if (_row.length) rows.push(_row);
            }
            
            else {break;}
        }
        return rows;
    }

    function getFollowingRows(_row) {
        // shift sonuna kadar rowlar
        head = getShiftHeadData(_row);
        let rows = [];
        let i = 1;
        while (true) {
            row = $(`#shift${head.shiftNo}depth${(head.shiftDepth + i)}`);
            i++;
            if (row.length) {
                rows.push(row);
            } else {break;}
        }
        return rows;
    }

    function exportClickListener() {
        boxes = $(`.dataBox`);
        data = [];
        for (let i = 0; i < boxes.length; i++) {
            data.push(convertBoxToDTO(boxes[i]));
        }
        postMethod(data);
    }

    function importClickListener() {
        //public int location_id { get; set; }
        //public short year { get; set; }
        //public byte month { get; set; }
        //public byte day { get; set; }
        //public int shift_id { get; set; }
        //public string group_code{ get; set; }


        let obj = {};
        obj.year = "yil";
        obj.month = "ay";
        // filtre uygulanarak tüm ShiftPlanDetailDTO arrayi alınacak


        //$.ajax({
        //    type: "POST",
        //    url: url,
        //    data: obj,
        //    success: function (response) {
        //    }
        //});


        //succes içinde

        if (response != null) {
            for (let i = 0;i < response.length;i++) {
                convertDTOToBox(response[i]);
            }
        }
        
    }

    function convertDTOToBox(dto) {
        let datax = dto.shift_id-1;
        let datay = dto.day - 1;
        let datateam = dto.group_code;
        let offset = 0;
        while (true) {
            let daydiv = $(`#x${datax}y${datay}z${offset}`);
            if (daydiv.length) {
                if (daydiv.attr("data-team") == "") {
                    arrangeDivCSS(daydiv, datateam);
                    break;
                }
            }
            else {
                upperRow = $(`#x${datax}y${datay}z${offset - 1}`);
                arrangeDivCSS(insertRow(upperRow), datateam);
            }
            offset++;
        }
        
        arrangeDivCSS(daydiv, next);
    }

    function postMethod(data) {
        //public int location_id { get; set; }
        //public short year { get; set; }
        //public byte month { get; set; }
        //public string creator { get; set; }
        //public DateTime createDate { get; set; }
        //public string approver { get; set; }
        //public DateTime approveDate { get; set; }
        //public ShiftPlanDetailDTO[] details { get; set; }

        let obj = {};
        obj.location_id;
        obj.year = $("#creadate").text();
        obj.month = $("#creadate").text();
        obj.creator = $("#creadate").text();
        obj.createDate = $("#creadate").text();
        obj.approver = $("#creadate").text();
        obj.approveDate = $("#creadate").text();
        obj.details=data;
        //$.ajax({
        //    type: "POST",
        //    url: url,
        //    data: obj,
        //    success: function (response) {
               
        //    }
        //});

        var json = JSON.stringify(obj);
        console.log(json);
    }

    function convertBoxToDTO(box) {
        //public int location_id { get; set; }
        //public short year { get; set; }
        //public byte month { get; set; }
        //public byte day { get; set; }
        //public int shift_id { get; set; }
        //public string group_code{ get; set; }
        box = $(box);
        let dto = {};
        dto.location_id;
        dto.year = $("#creadate").text();
        dto.month = 7;
        dto.day = Number(box.attr("data-y"))+1;
        dto.shift_id = Number(box.attr("data-x")) + 1;
        dto.group_code = box.attr("data-team");
        return dto;
    }