import express, { Request, Response } from 'express';
import EmployeesControllers from '../controllers/employees.js';

const employeesRouter = express.Router();
const employeesControllers = new EmployeesControllers();

employeesRouter.get('/', async (req: Request, res: Response) => {
  const httpResponse = await employeesControllers.getEmployees();
  res.status(httpResponse.statusCode).send(httpResponse);
});

employeesRouter.post('/', async (req: Request, res: Response) => {
  const httpResponse = await employeesControllers.addEmployee(req.body);
  res.status(httpResponse.statusCode).send(httpResponse);
});

employeesRouter.delete('/:id', async (req: Request, res: Response) => {
  const httpResponse = await employeesControllers.deleteEmployee(req.params.id);
  res.status(httpResponse.statusCode).send(httpResponse);
});

employeesRouter.put('/:id', async (req: Request, res: Response) => {
  const httpResponse = await employeesControllers.updateEmployee(
    req.params.id,
    req.body
  );
  res.status(httpResponse.statusCode).send(httpResponse);
});

export default employeesRouter;