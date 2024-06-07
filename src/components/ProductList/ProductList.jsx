import React, {useState} from 'react';
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', title: 'Смартфон Samsung Galaxy S21', price: 25000, description: 'Чорний, з потужною камерою'},
    {id: '2', title: 'Ноутбук ASUS ZenBook', price: 40000, description: 'Сріблястий, з високою продуктивністю'},
    {id: '3', title: 'Телевізор LG OLED', price: 60000, description: '55-дюймовий, з вражаючим кольором та контрастом'},
    {id: '4', title: 'Гарнітура Sony WH-1000XM4', price: 8000, description: 'Навушники з активним шумозаглушенням'},
    {id: '5', title: 'Фотокамера Canon EOS R5', price: 120000, description: 'Дзеркальна, з 8К-відеозйомкою'},
    {id: '6', title: 'Планшет Apple iPad Pro', price: 35000, description: 'З 12,9-дюймовим Liquid Retina дисплеєм'},
    {id: '7', title: 'Ігрова консоль PlayStation 5', price: 35000, description: 'З потужним процесором та швидкісним SSD'},
    {id: '8', title: 'Навушники Apple AirPods Pro', price: 9000, description: "З активним шумозаглушенням та бездротовим з'єднанням"},
];


const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купити ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;