import { IController } from "domain-utilities";
import { Request, Response } from "express";

export abstract class ExpressControllerAdapter {
  constructor(private readonly controller: IController<any, any>) {}

  async execute(req: Request, res: Response) {
    const response = await this.controller.execute(req);
    res.json(response.body);
  }
}
