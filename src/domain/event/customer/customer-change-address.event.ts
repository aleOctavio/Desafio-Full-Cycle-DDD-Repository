import EventInterface from "../@shared/event.interface";

export default class CustomerChangeAddressEvent implements EventInterface{
    dataTimeOcurred: Date;
    eventData: any;

    constructor(event: any){
        this.dataTimeOcurred = new Date();
        this.eventData = event;
    }
}