import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import OrderRepository from "./order.repository";
import ProductRepository from "./product.repository";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);

        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const orderRepository = new OrderRepository();
        const order = new Order("123", "123", [orderItem]);
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne(
            {
                where: { id: order.id },
                include: ["items"]
            });


        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123"
                },
            ],
        });


    });

    it("should update a order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);

        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const orderRepository = new OrderRepository();
        const order = new Order("123", "123", [orderItem]);
        await orderRepository.create(order);

        const newOrderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            10
        );

        const newOrder = new Order(order.id, order.customerId, [newOrderItem]);

        await orderRepository.update(newOrder);

        const orderModel = await OrderModel.findOne(
            {
                where: { id: newOrder.id },
                include: ["items"]
            });


        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: newOrder.total(),
            items: [
                {
                    id: newOrderItem.id,
                    name: newOrderItem.name,
                    price: newOrderItem.price,
                    quantity: newOrderItem.quantity,
                    order_id: "123",
                    product_id: "123"
                },
            ],
        });


    });

    it("should find a order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);

        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product1 = new Product("123", "Product 1", 10);
        await productRepository.create(product1);

        const product2 = new Product("456", "Product 2", 50);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem(
            "1",
            product1.name,
            product1.price,
            product1.id,
            2
        );

        const orderItem2 = new OrderItem(
            "2",
            product2.name,
            product2.price,
            product2.id,
            10
        );

        const orderRepository = new OrderRepository();
        const order = new Order("123", "123", [orderItem1, orderItem2]);
        await orderRepository.create(order);

        const orderResult = await orderRepository.find(order.id);

        expect(orderResult).toEqual(order);
    });

    it("should find all orders", async () => {

        const customerRepository = new CustomerRepository();

        const customer1 = new Customer("123", "Customer 1");
        const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer1.changeAddress(address1);

        const customer2 = new Customer("124", "Customer 2");
        const address2 = new Address("Street 2", 1, "Zipcode 2", "City 2");
        customer2.changeAddress(address2);

        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const productRepository = new ProductRepository();
        const product1 = new Product("123", "Product 1", 10);
        await productRepository.create(product1);

        const product2 = new Product("456", "Product 2", 50);
        await productRepository.create(product2);

        const orderItem1 = new OrderItem(
            "1",
            product1.name,
            product1.price,
            product1.id,
            2
        );

        const orderItem2 = new OrderItem(
            "2",
            product2.name,
            product2.price,
            product2.id,
            10
        );

        const orderItem3 = new OrderItem(
            "3",
            product2.name,
            product2.price,
            product2.id,
            15
        );

        const orderRepository = new OrderRepository();
        const order1 = new Order("123", customer1.id, [orderItem1, orderItem2]);
        const order2 = new Order("124", customer2.id, [orderItem3]);

        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders).toHaveLength(2);
        expect(orders).toContainEqual(order1);
        expect(orders).toContainEqual(order2);
    });

});