import fs from "fs";

export const checkSwearWord = (char : string) =>{
    const rowsJson = fs.readFileSync("./src/Data/Json/SwearWord.json", "utf8");
    const swearWords = JSON.parse(rowsJson) as []

    swearWords.forEach(swearWord => {
        const words = char.split(' ')
        words.forEach(word => {
            if(word.toLowerCase() == swearWord){
                 throw new Error("Vous ne pouvez pas mettre d'injure dans une ressource public")
            }
        })

    });
}

