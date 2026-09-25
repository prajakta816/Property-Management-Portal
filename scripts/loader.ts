const loader = document.getElementById("loader");

if(!loader){
    throw new Error("Loader element not found");
}

export function showLoder():void{
    const loader = document.getElementById("loader");
    if(!loader){
        throw new Error("Loader element not found");
    }
    loader.style.display = "block";
}

export function hideLoader():void{
    const loader = document.getElementById("loader");
    if(!loader){
        throw new Error("Loader element not found");
    }
    loader.style.display = "none";
}