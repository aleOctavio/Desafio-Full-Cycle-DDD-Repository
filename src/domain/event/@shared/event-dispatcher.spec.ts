import Address from "../../entity/address";
import Customer from "../../entity/customer";
import CustomerChangeAddressEvent from "../customer/customer-change-address.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import SendConsoleLogHandler from "../customer/handler/send-console-log.handler";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain Events tests", () => {

    it("should register an event handler", () => {

        const eventDispatcher = new EventDispatcher();

        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should unregister an event handler", () => {

        const eventDispatcher = new EventDispatcher();

        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it("should unregister all event handlers", () => {

        const eventDispatcher = new EventDispatcher();

        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });

    it("should notify all event handlers", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const eventHandler2 = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        eventDispatcher.register("ProductCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product description 1",
            price: 10.0,
        });

        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toBeCalled();
    });

    it("should register a customer event handler", () => {

        const eventDispatcher = new EventDispatcher();

        const eventHandler1 = new SendConsoleLogHandler();
        const eventHandler2 = new SendConsoleLogHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);
    });

    it("should unregister customer event handler", () => {

        const eventDispatcher = new EventDispatcher();

        const eventHandler1 = new SendConsoleLogHandler();
        const eventHandler2 = new SendConsoleLogHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0);
    });

    it("should unregister all customer event handlers", () => {

        const eventDispatcher = new EventDispatcher();

        const eventHandler1 = new SendConsoleLogHandler();
        const eventHandler2 = new SendConsoleLogHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();
    });

    it("should notify all customer event handlers", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new SendConsoleLogHandler();
        const eventHandler2 = new SendConsoleLogHandler();
        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

        const customerCreatedEvent1 = new CustomerCreatedEvent({
            message: "Esse é o primeiro console.log do evento: CustomerCreated",
        });

        const customerCreatedEvent2 = new CustomerCreatedEvent({
            message: "Esse é o segundo console.log do evento: CustomerCreated",
        });

        eventDispatcher.notify(customerCreatedEvent1);
        eventDispatcher.notify(customerCreatedEvent2);

        expect(spyEventHandler1).toBeCalled();
        expect(spyEventHandler2).toBeCalled();
    });

    it("should notify customer change address event handlers", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLogHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerChangeAddressEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandler);

        const customer = new Customer("1", "Customer 1");
        const address = new Address("Street 1", 1, "12345-678", "City 1");
        customer.changeAddress(address);

        const message = `Endereço do cliente: ${customer.id}, ${customer.name} alterado para ${customer.address.toString()}`;

        const customerChangeAddressEvent = new CustomerChangeAddressEvent(message);

        eventDispatcher.notify(customerChangeAddressEvent);

        expect(spyEventHandler).toBeCalled();
    });

});