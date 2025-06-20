import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class SendConsoleLogHandler implements EventHandlerInterface<CustomerCreatedEvent>{
   
    handle(event: CustomerCreatedEvent): void {
        console.log(event.eventData);
    }
}