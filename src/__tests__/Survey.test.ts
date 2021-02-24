import request from "supertest"
import { app } from "../app"
import createConnection from "../database"

describe("Surveys", ()=> {
    beforeAll(async()=> {
        const connection = await createConnection()
        await connection.runMigrations()
    })

    it("Shoul be able to create a new servey", async() => {
        const response = await request(app).post("/serveys")
        .send({
            title: "title example1",
            description: "description example1"
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id")
    })
   
    it("Shoul not be able to get all surveys", async() => {
        await request(app).post("/serveys")
        .send({
            title: "title example2",
            description: "description example2"
        })

        const response = await request(app).get("/serveys")
    
        expect(response.body.length).toBe(2)
    })
    
})