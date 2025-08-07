import express from 'express'
import { addSchool , getAllSchools , deleteSchool ,updateSchool , requestSchool } from '../controller/school.js'

const router = express.Router()

router.post('/add', addSchool)
router.post('/request', requestSchool)
router.get('/get',getAllSchools)
router.put('/update/:id', updateSchool)
router.delete('/delete/:id', deleteSchool);



export default router