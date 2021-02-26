import { resolve } from 'path';
import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { SurveysRepository } from "../repositories/SurveysRepository"
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository"
import { UsersRepository } from "../repositories/UsersRepository"
import SendMailService from "../services/SendMailService"

class SendMailController {
    async execute(req:Request , res: Response){
        const {email, survey_id} = req.body

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository)
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        const userExists = await usersRepository.findOne({email})

        if(!userExists){
            return res.status(400).json({error:"User does not exists."})
        }

        const surveysExists = await surveysRepository.findOne({id: survey_id})

        if(!surveysExists){
            return res.status(400).json({error: "Survey does not exists."})
        }

        const surveyUserExists = await surveysUsersRepository.findOne({
            where: {user_id: userExists.id, value: null},
            relations: ["user", "survey"]
        })

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const variables = {
            name: userExists.name,
            title: surveysExists.title,
            description: surveysExists.description,
            id: "",
            link: process.env.URL_MAIL
        }
        
        
        if(surveyUserExists){
            variables.id = surveyUserExists.id
            await SendMailService.execute(email, surveysExists.title, variables, npsPath)
            return res.json(surveyUserExists)
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: userExists.id,
            survey_id
        })

        await surveysUsersRepository.save(surveyUser)

        variables.id =surveyUser.id
        
        await SendMailService.execute(email, surveysExists.title, variables, npsPath)

        return res.json(surveyUser)
    }
}

export { SendMailController }
