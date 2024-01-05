//component creato come page.tsx dentro una cartella e non serve fare altro
//http://localhost:3000/component
//nota: viene ingobato dentro layout del padre e ha anche lui un layout che viene ereditato dei figli dentro
//nota: aggiunto async così chiama quello sotto
export default async function Component() {
    const data:User[] = await getData();
    return (
        <div>
            <h1>Component prova</h1>
            <ul>
            {   data?.map ( user =>{
                    return <li key={user.id}>{user.name}</li>
                })
            }
            </ul>
            <pre>{JSON.stringify(data,null,2)}</pre>
        </div>
        
    )
}
//see https://www.youtube.com/watch?v=qArqvh6yhiE
//nota: il cache serve per il render dinamico, see https://www.youtube.com/watch?v=7UFaZqvkzPM
async function getData() : Promise<User[]>{
    const res = await fetch("https://jsonplaceholder.typicode.com/users" , {cache:'no-store'});
    
    return res.json();
}

interface User {
    id:string;
    name:string;
    //others
}