const Order = require('../models/Order');
const Dish = require('../models/Dish');
const Session = require('../models/ClientSession');
const Table = require('../models/Table');
const logger = require('../utils/logger');

class OrderService {
    /**
     * Create a new order
     */
    async createOrder(sessionId, items, note = '') {
        try {
            // 1. Verify session
            const session = await Session.findOne({ session_id: sessionId });
            if (!session) {
                throw new Error('Invalid or expired session');
            }

            // 2. Format items and calculate total price
            const orderItems = [];
            let calculatedTotal = 0;

            for (const item of items) {
                const dish = await Dish.findById(item.dish_id);

                if (!dish) {
                    throw new Error(`Dish with ID ${item.dish_id} not found`);
                }

                if (!dish.disponible) {
                    throw new Error(`Dish "${dish.nom}" is currently unavailable`);
                }

                const itemTotal = dish.prix * item.quantity;
                calculatedTotal += itemTotal;

                orderItems.push({
                    dish_id: dish._id,
                    name: dish.nom,
                    quantity: item.quantity,
                    price: dish.prix,
                    comment: item.comment || ''
                });
            }

            // 3. Create Order
            const order = new Order({
                table_id: session.table_id,
                session_id: sessionId,
                items: orderItems,
                total_price: calculatedTotal,
                note: note,
                status: 'PENDING'
            });

            await order.save();
            logger.info('Order created', { orderId: order._id, tableId: session.table_id, total: calculatedTotal });

            return order;
        } catch (error) {
            logger.error('Error creating order', { error: error.message });
            throw error;
        }
    }

    /**
     * Get order by ID
     */
    async getOrderById(orderId) {
        try {
            const order = await Order.findById(orderId)
                .populate('table_id')
                .populate('items.dish_id');

            if (!order) {
                throw new Error('Order not found');
            }
            return order;
        } catch (error) {
            logger.error('Error getting order', { error: error.message });
            throw error;
        }
    }

    /**
     * Get orders by session
     */
    async getOrdersBySession(sessionId) {
        try {
            const orders = await Order.find({ session_id: sessionId })
                .sort({ createdAt: -1 });
            return orders;
        } catch (error) {
            logger.error('Error getting session orders', { error: error.message });
            throw error;
        }
    }

    /**
     * Update order status
     */
    async updateOrderStatus(orderId, status) {
        try {
            const allowedStatuses = ['PENDING', 'PREPARING', 'READY', 'SERVED', 'PAID', 'CANCELLED'];
            if (!allowedStatuses.includes(status)) {
                throw new Error(`Invalid status: ${status}`);
            }

            const order = await Order.findByIdAndUpdate(
                orderId,
                { status },
                { new: true }
            );

            if (!order) {
                throw new Error('Order not found');
            }

            logger.info('Order status updated', { orderId, status });
            return order;
        } catch (error) {
            logger.error('Error updating order status', { error: error.message });
            throw error;
        }
    }
}

module.exports = new OrderService();
