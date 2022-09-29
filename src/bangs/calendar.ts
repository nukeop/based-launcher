import { Calendar } from "../components/Calendar/Calendar";
import { EmptyBangResponse, IBang, WidgetBangResponse } from "./bangs";

export class CalendarBang
  implements IBang<WidgetBangResponse<typeof Calendar> | EmptyBangResponse>
{
  isPresent(input: string) {
    return input.includes("!cal");
  }

  async onActivate(input: string) {
    return { widget: Calendar, type: "widget" as const };
  }
}
