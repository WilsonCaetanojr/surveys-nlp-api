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

        const surveyUser = surveysUsersRepository.create({
            user_id: userExists.id,
            survey_id
        })

        await surveysUsersRepository.save(surveyUser)

        await SendMailService.execute(email, surveysExists.title, surveysExists.description)

        return res.json(surveyUser)
    }
}

export { SendMailController }
