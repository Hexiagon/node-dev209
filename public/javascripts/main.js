let NoteArray = [];

let NoteObject = function (pName, pType, pAddress, pStar, pURL){
    this.Name= pName;
    this.Type= pType;
    //this.ID= NoteArray.length + 1;
    this.ID= Math.random().toString(16).slice(5)
    this.Address = pAddress;
    this.Star = pStar;
    this.URL= pURL;
}

// NoteArray.push (new NoteObject( "McDonald", "Fast Food", "3239 156th Ave SE, Bellevue, WA 98007", "5 Stars", "https://www.mcdonalds.com/us/en-us.html" ));
// NoteArray.push (new NoteObject( "Rain Cafe", "Cafe", "13200 Aurora Ave N suite c, Seattle, WA 98133", "4 Stars", "https://www.orderraincafe.com/"));
// NoteArray.push (new NoteObject( "El Gran Taco", "Food Truck", "Seattle, WA 98122", "5 Stars", "https://elgrantacoseattle.com/home.php"));


let selectedType = "not selected";
let starRating ="not selected";
document.addEventListener("DOMContentLoaded", function(){

    createList();

    document.getElementById("buttonAdd").addEventListener("click", function (){

        let newResturant=new NoteObject(document.getElementById("name").value, 
        selectedType, 
        document.getElementById("address").value, 
        starRating, 
        document.getElementById("URL").value);
        //document.location.href="index.html#list";
        $.ajax({
            url : 'AddResturant',
            type : 'POST',
            data : JSON.stringify(newResturant),
            contentType : 'application/json; charset=utf-8',
            success: function(result){
                console.log(result);
                document.location.href="index.html#list";
            },
            error: function(xhr,testStatus,errorThrown){
                alert("Server could not add Resturant: "+newResturant.Name);
                alert(testStatus+" "+errorThrown);
            }
        });
    });


    document.getElementById("buttonClear").addEventListener("click", function(){
        document.getElementById("name").value="";
        document.getElementById("address").value="";
        document.getElementById("URL").value="";
    });
    
    document.addEventListener("change", function(event){
        if (event.target.id === "select-type") {
            selectedType = event.target.value;
        }
    });
    
    document.addEventListener("change", function(event){
        if (event.target.id === "star-rating") {
            starRating = event.target.value;
        }
    });

    $(document).on("pagebeforeshow", "#list", function(event){ //jQuery
        createList();
    });

    $(document).on("pagebeforeshow", "#details", function(event){
        let localID= localStorage.getItem("parm");
        NoteArray= JSON.parse(localStorage.getItem("NoteArray"));
        let pointer= GetObjectPointer(localID);
        document.getElementById("resturantName").innerHTML= "Name: "+NoteArray[pointer].Name;
        document.getElementById("resturantType").innerHTML= "Type: "+NoteArray[pointer].Type;
        document.getElementById("resturantAddress").innerHTML= "Address: "+NoteArray[pointer].Address;
        document.getElementById("resturantStar").innerHTML= "Star-rating: "+NoteArray[pointer].Star;
        document.getElementById("resturantURL").innerHTML="URL: "+NoteArray[pointer].URL;
    });
    document.getElementById("r.Website").addEventListener("click", function(){
        openWebsite(localStorage.getItem("parm"));
    });
});

function GetObjectPointer(whichID){
    for(i=0;i<NoteArray.length;i++){
        if(NoteArray[i].ID==whichID){
            return i;
        }
    }
}

//create the function to add list 
function createList(){
    const theTable = document.getElementById('tableID');
    theTable.innerHTML="";
    //add the headings
    //theTable.innerHTML ="<thead><th>ID</th><th>Name</th><th>Type</th><th>Address</th><th>Rating</th></thead>";
    theTable.innerHTML ="<thead><th>ID</th><th>Name</th><th>Type</th></thead>";
    $.get('/getAllResturants',function(data,status){
        NoteArray=data;
    
    //add the row
    for(oneRts of NoteArray){
        const newRow = document.createElement("tr");
        newRow.setAttribute("data-parm",oneRts.ID);
        const tdID = document.createElement("td");
        tdID.setAttribute("data-parm",oneRts.ID);
        const tdName = document.createElement("td");
        tdName.setAttribute("data-parm",oneRts.ID);
        const tdType = document.createElement("td");
        //const tdAddress = document.createElement("td");
        //const tdRating = document.createElement("td");
        tdID.textContent = oneRts.ID;
        tdName.textContent = oneRts.Name;
        tdType.textContent = oneRts.Type;
        //tdAddress.textContent = oneRts.Address;
        //tdRating.textContent = oneRts.Star;
        newRow.appendChild(tdID);
        newRow.appendChild(tdName);
        newRow.appendChild(tdType);
        //newRow.appendChild(tdAddress);
        //newRow.appendChild(tdRating);
        theTable.appendChild(newRow);
    }
    //add row click event handlers
    var table = document.getElementById("tableID");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++){
        var currentRow = table.rows[i];
        var createClickHandler =
            function(row)
            {
                return function() {
                    //var cell = row.getElementsByTagName("td")[0];
                    //var whichID = cell.innerHTML;
                    //openWebsite(whichID);
                    var parm=this.getAttribute("data-parm");
                    localStorage.setItem('parm',parm);
                    let stringMovieArray = JSON.stringify(NoteArray);
                    localStorage.setItem('NoteArray', stringMovieArray);
                    document.location.href="index.html#details";
                };
            };
        currentRow.onclick = createClickHandler(currentRow);
    }
    });
};
function openWebsite(which){
    for(let i = 0; i < NoteArray.length; i++){
        if(which == NoteArray[i].ID){
            window.open(NoteArray[i].URL);
        }
    }
}