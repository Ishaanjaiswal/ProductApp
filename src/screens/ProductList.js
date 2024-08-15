import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ActivityIndicator, TouchableOpacity, Modal, Button, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, incrementQuantity, decrementQuantity } from '../redux/actions';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    useEffect(() => {
        fetchData();

    }, []);

    const fetchData = async() => {
        try {
            const response = await fetch('https://fakestoreapi.com/products')
            let data = await response.json();
            if (response.ok) {
                setProducts(data);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }
    const handleProductPress = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        // setModalVisible(false);
    };

    const handleIncrement = (id) => {
        dispatch(incrementQuantity(id));
    };

    const handleDecrement = (id) => {
        dispatch(decrementQuantity(id));
    };

    const cartProduct = cart.find((item) => item.id === selectedProduct?.id);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleProductPress(item)} style={styles.productItem}>
                        <Image source={{ uri: item.image }} style={styles.productImage} />
                        <Text style={styles.productTitle}>{item.title}</Text>
                        <Text style={styles.productPrice}>Rs. {item.price}</Text>
                    </TouchableOpacity>
                )}
            />
            {selectedProduct && (
                <Modal
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                    transparent={true}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Image
                                source={{ uri: selectedProduct.image }}
                                style={styles.modalImage}
                            />
                            <Text style={styles.productTitle}>{selectedProduct.title}</Text>
                            <Text>{selectedProduct.description}</Text>
                            <Text style={styles.productPrice}>Rs. {selectedProduct.price}</Text>

                            {cartProduct ? (
                                <View style={styles.cartControls}>
                                    <Button title="-" onPress={() => handleDecrement(selectedProduct.id)} />
                                    <Text style={styles.quantity}>{cartProduct.quantity}</Text>
                                    <Button title="+" onPress={() => handleIncrement(selectedProduct.id)} />
                                </View>
                            ) : (
                                <Button title="Add to Cart" color='orange' onPress={() => handleAddToCart(selectedProduct)} />
                            )}

                            <Button title="Close" color='grey' onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    productItem: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    productImage: {
        width: 150,
        height: 150,
        borderRadius: 5,
        marginBottom: 10,
        alignSelf: 'center'
    },
    productTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 14,
        color: '#333',
        fontWeight:'700'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    cartControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    quantity: {
        fontSize: 18,
        marginHorizontal: 10,
    },
});

export default ProductList;
