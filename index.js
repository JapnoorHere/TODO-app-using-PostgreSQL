const express = require('express');
const { Pool } = require('pg')

const app = express();
const port = 3000;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "todos",
    password: "root",
    port: 5432
});

app.use(express.json());

app.get('/todos', (req, res) => {
    pool.query("Select * from todos", (error, result) => {
        if (error) {
            console.error('error fetching todos', error);
            res.status(500).json({ error: "Internal Server error" });
        }
        else {
            res.json(result.rows);
        }
    });
});

app.post('/todos', (req, res) => {
    const { title, completed } = req.body;
    pool.query('Insert into todos (title,completed) values ($1,$2)', [title, completed], error => {
        if (error) {
            console.log(error);
            res.status(201).json({ error: "Error" });
        }
        else {
            res.status(201).json({ message: "Todo created successfully" });
        }
    });
});

app.put('/todos/:id',(req,res)=>{
    const {id} = req.params;
    const {title,completed} = req.body;
    pool.query('Update todos set title = $1, completed = $2 where id = $3',[title,completed,id],error=>{
        if(error){
            console.error(error);
            res.status(500).json({error : "Error"});
        }
        else{
            res.status(201).json({message : "Updated successfully"});
        }
    })
});

app.delete('/todos/:id',(req,res)=>{
    const {id} = req.params;
    pool.query("Delete from todos where id = $1" ,[id],(error)=>{
        if(error){
            console.error(error);
            res.status(500).json({error : "Error"});
        }
        else{
            res.status(201).json({message : "Deleted successfully"});
        }
    })
})

app.listen(port, () => {
    console.log("listening");
});