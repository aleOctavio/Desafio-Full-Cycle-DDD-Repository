import Order from "./order";
import OrderItem from "./order_item";


describe("Order unit tests", () => {

    it("should throw error when id is empty", () => {

        expect(() => {
            let order = new Order("", "123", []);
        }).toThrowError("Id is required.");
    });

    it("should throw error when customerId is empty", () => {

        expect(() => {
            let order = new Order("123", "", []);
        }).toThrowError("Customer id is required.");
    });

    it("should throw error when item qtd is 0", () => {

        expect(() => {
            let order = new Order("123", "123", []);
        }).toThrowError("Item qtd must be greater than 0");
    });

    it("should calculate total", () => {

        const item1 = new OrderItem("i1", "Item 1", 100, "p1", 2);
        const item2 = new OrderItem("i2", "Item 2", 150, "p2", 2);
        const order1 = new Order("o1", "c1", [item1]);

        let total = order1.total();

        expect(total).toBe(200);

        const order2 = new Order("o2", "c2", [item1, item2]);

        total = order2.total();

        expect(total).toBe(500);
    });

    it("should throw error if the item qtd is less or equal zero", () => {

        expect(() =>{
            const item1 = new OrderItem("i1", "Item 1", 100, "p1", 0);
            const order1 = new Order("o1", "c1", [item1]);
        }).toThrowError("Quantity must be greater then 0.")

    });

});