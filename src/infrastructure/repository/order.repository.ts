import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";


export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {

        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    product_id: item.productId
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            });
    }

    async update(entity: Order): Promise<void> {

        const order = OrderModel.findByPk(entity.id, {
            include: [{ model: OrderItemModel }]
        });

        (await order).update(
            {
                customer_id: entity.customerId,
                total: entity.total(),
            }
        );

        await OrderItemModel.destroy({ where: { order_id: entity.id } });

        const items = entity.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            product_id: item.productId,
            order_id: entity.id
        }));

        await OrderItemModel.bulkCreate(items);

        // await Promise.all(
        //     (await order).items.map(async (itemModel) => {
        //         const itemEntity = entity.items.find(i => i.id === itemModel.id)
        //         itemModel.destroy()
        //         if (itemEntity) {
        //             await itemModel.update(
        //                 {
        //                     id: itemEntity.id,
        //                     name: itemEntity.name,
        //                     price: itemEntity.price,
        //                     quantity: itemEntity.quantity,
        //                     product_id: itemEntity.productId
        //                 }
        //             )
        //         }
        //     })
        // );

    }

    async find(id: string): Promise<Order> {

        const orderModel = await OrderModel.findOne(
            {
                where: { id: id },
                include: [{ model: OrderItemModel }]
            });

        const order = new Order(id,
            orderModel.customer_id,
            orderModel.items.map((itemModel) => {
                return new OrderItem(
                    itemModel.id,
                    itemModel.name,
                    itemModel.price,
                    itemModel.product_id,
                    itemModel.quantity);
            }));

        return order;
    }

    async findAll(): Promise<Order[]> {

        const orderModels = await OrderModel.findAll({ include: [{ model: OrderItemModel }] });

        const orders = orderModels.map((orderModel) => {
            const order = new Order(orderModel.id,
                orderModel.customer_id,
                orderModel.items.map((item) => {
                    return new OrderItem(
                        item.id,
                        item.name,
                        item.price,
                        item.product_id,
                        item.quantity);
                })
            );

            return order;
        });

        return orders;
    }

}