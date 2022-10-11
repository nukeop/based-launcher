import { EmptyBangResponse, IBang, ValueBangResponse } from "./bangs";
import Formula from "fparser";

export class CalculatorBang
  implements IBang<ValueBangResponse | EmptyBangResponse>
{
  isPresent(input: string) {
    try {
      const formula = new Formula(input);
      return formula.evaluate({});
    } catch (e) {
      return false;
    }
  }

  async onActivate(
    input: string
  ): Promise<ValueBangResponse | EmptyBangResponse> {
    const formula = new Formula(input);

    return {
      type: "value",
      value: formula.evaluate({}).toString(),
    };
  }
}
