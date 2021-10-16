
let product_elements = {
    name:'test',
    category:'test',
    price:'test',
    description:'test'
}



product_elements.name =  document.getElementById('ProductName');
product_elements.category = document.getElementById('ProductCategory');
product_elements.price = document.getElementById('ProductPrice');
product_elements.description = document.getElementById('ProductDescription');
var updatebutton = document.getElementById('update-btn');
var addbutton = document.getElementById('add-btn');
var searchField = document.getElementById('search');

var ls_productDisplaylist = 'productDisplayList';
var productDisplayList = [];

window.onload = function()
{
    productDisplayList = JSON.parse(localStorage.getItem(ls_productDisplaylist));

    hideUpdateButton();
    if(productDisplayList==null)
    {
        productDisplayList=[];
    }
  
    displayProduct();
    
}
function addProduct()
{
    let product_display = {
        name:'test',
        category:'test',
        price:'test',
        description:'test'
    }
    
    product_display.name = product_elements.name.value;
    product_display.category= product_elements.category.value;
    product_display.price = Number(product_elements.price.value);
    product_display.description = product_elements.description.value;

    if(!(product_display.name && product_display.category && product_display.price && product_display.description))
    {
        window.alert("Please enter all values");
      
    }
    else
    {
       
        
        productDisplayList.push(product_display);
        localStorage.setItem(ls_productDisplaylist,JSON.stringify(productDisplayList));
        displayProduct();
    }
    
   

}

function clearProduct()
{
    product_elements.name.value = '';
    product_elements.category.value = '';
    product_elements.price.value = '';
    product_elements.description.value = '';
    hideUpdateButton();

}

var tableContents_list = [''];


    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

function displayProduct(DisplaySet = {})
{
    var tableContent ='';
    var highlight_startTag = '<span style="background-color: #FFFF00", font-weight : "400">';
    var highlight_endTag = '</span>';

   

    for(let i =0 ; i< productDisplayList.length ; i++)
    {

        var name ='';

       if(!isEmpty(DisplaySet))
       {    
            
            if(DisplaySet.excludedItems.indices.includes(i) )
                    {
                            continue;
                    };

                    var hlightStartIndex = DisplaySet.includedItems.displayProperties.highlight[i].startIndex;
                    var hlightEndIndex= DisplaySet.includedItems.displayProperties.highlight[i].endIndex;

                    console.log(DisplaySet.includedItems);
                    console.log(i);

                for(var j = 0 ; j < productDisplayList[i].name.length ; j++)
                {    
                   
                    if(j>=hlightStartIndex &&  j<=hlightEndIndex)
                    {
                  
                        if(j==hlightStartIndex && j==hlightEndIndex)
                        {
                            name =  name + highlight_startTag + productDisplayList[i].name[j]+highlight_endTag;
                            continue;
                        }
                        else if(j==hlightStartIndex)
                        {
                            name =  name + highlight_startTag + productDisplayList[i].name[j];
                            continue;
                        }
                        else if(j==hlightEndIndex)
                        {
                         
                            name =  name + productDisplayList[i].name[j]+highlight_endTag;
                            continue;
                        }
                        
                            name = name + productDisplayList[i].name[j];
                        

                    }
                    else
                    {
                        name = name + productDisplayList[i].name[j];
                    }

                }

       
      }
       else 
       {
        name = productDisplayList[i].name;
       }
       
        console.log('Name ' + name);
       

            tableContents_list[i]= `<tr>
            <td>${i}</td>
            <td>${name}</td>
            <td>${productDisplayList[i].category}</td>
            <td>${productDisplayList[i].price}</td>
            <td>${productDisplayList[i].description}</td>
            <td><button class="btn btn-outline-primary" id='update-${i}'  onclick='updateProduct(${i})'>Update</button></td>
            <td><button class="btn btn-outline-danger" id='delete-${i}' onclick='deleteProduct(${i})'>delete</button></td>
            </tr>`;
           
          
        
        tableContent= tableContent + tableContents_list[i];
 


    }
    document.getElementById('table').innerHTML= tableContent;
}


function deleteProduct(rowIndex)
{

  
    var removed = productDisplayList.splice(rowIndex,1);
    localStorage.setItem(ls_productDisplaylist,JSON.stringify(productDisplayList));

    displayProduct();


}

var updatedRowIndex=0;

function updateProduct(rowIndex)
{
    clearProduct();

    updatedRowIndex = rowIndex;

    product_elements.name.value = productDisplayList[rowIndex].name;
    product_elements.category.value = productDisplayList[rowIndex].category;
    product_elements.price.value = productDisplayList[rowIndex].price;
    product_elements.description.value = productDisplayList[rowIndex].description;

    showUpdateButton();

}

function editUpdatedProduct()
{

    productDisplayList[updatedRowIndex].name = product_elements.name.value;
    productDisplayList[updatedRowIndex].category = product_elements.category.value;
    productDisplayList[updatedRowIndex].price = product_elements.price.value;
    productDisplayList[updatedRowIndex].description = product_elements.description.value;

    displayProduct();
    hideUpdateButton();
    clearProduct();

}


function showUpdateButton(){

    updatebutton.style.display= 'inline';
    addbutton.style.display = 'none';

}

function hideUpdateButton(){
    addbutton.style.display= 'inline';
    updatebutton.style.display = 'none';
}

function searchItem()
{
    
let highlightSection = {
    startIndex :'',
    endIndex:''
}


let DisplaySet = {
    
    'includedItems' : { 
        'indices':[],
        'displayProperties': { 
          'highlight':[]

                             }
    },
  
    'excludedItems' : {
        'indices':[]
    }
   
        
    };
    

    if(searchField.value.length)
    {
       
        

        for(var i=0; i <productDisplayList.length ; i++ )
        {
            
            var upperCaseQuery = searchField.value.toUpperCase();
            var upperCaseItem = productDisplayList[i].name.toUpperCase();
            var highlightIndices = Object.create(highlightSection);
           
            if(!(upperCaseItem.includes(upperCaseQuery)))
            {
                DisplaySet.excludedItems.indices.push(i);
            
                highlightIndices.startIndex = -1;
                highlightIndices.endIndex =-1;
                DisplaySet.includedItems.displayProperties.highlight.push(highlightIndices);
                
               
                
                continue;
               
            }

            DisplaySet.includedItems.indices.push(i);

            if(upperCaseQuery.length==1)
            {
                highlightIndices.startIndex =upperCaseItem.indexOf(upperCaseQuery);
                highlightIndices.endIndex = highlightIndices.startIndex ;

                DisplaySet.includedItems.displayProperties.highlight.push(highlightIndices);

            }

            else
            {
         
                
                highlightIndices.startIndex =upperCaseItem.indexOf(upperCaseQuery);
                highlightIndices.endIndex = upperCaseItem.indexOf(upperCaseQuery) + upperCaseQuery.length -1;

                DisplaySet.includedItems.displayProperties.highlight.push(highlightIndices);


                
            }
           

    
        }

       
        
        displayProduct(DisplaySet);

    
        

    }

    
}

function resetPostSearch()
{
    if(searchField.value.length==0)
    {
        displayProduct();
        

    }
    
}



var h1s = document.querySelectorAll('h1');

for (let i = 0 ; i< h1s.length; i++)
{
    h1s[i].addEventListener('click',function(){
        alert("here i am");
    })
}


var demo = document.getElementById('demo');


demo.addEventListener('click',function()
{

    demo.style.backgroundColor = 'tomato';
    demo.style.width = '500';
    demo.style.transition = 'width 1s, background-color 1s'
})


var link = document.getElementById('link');
var img = document.getElementById('imgNew');

link.addEventListener('click',function()
{
    img.setAttribute('src','./images/download.png');
    img.setAttribute('alt','innovaXR');
    img.classList.toggle('rounded-circle');

    console.log(link.classList)
})

img.addEventListener('dragend',function(e){

    
    img.style.position = 'absolute';
    img.style.left = e.clientX;
    img.style.top = e.clientY;
    
})

var h1  = document.createElement('h1');
var section = document.getElementById('sec');

h1.innerHTML = 'test test'

section.prepend(h1);



