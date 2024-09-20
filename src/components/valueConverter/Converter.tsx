import React, { useEffect, useState } from "react"
import axios from "axios";

import ValueInput from "../valueInput/ValueInput";


import './css/converter.scss'


const CRYPTO_API_KEY = '440CDA30-79A4-4F07-B22C-CEEFBFE51442'; //Получить достпу к API
const CRYPTO_API_URL = 'https://rest.coinapi.io/v1/exchangerate' //Запрос к restcoin, доступное некоторое количество запросов в день=
const FIAT_API_URL = 'https://v6.exchangerate-api.com/v6'; //Запрос к exchangerate 
const FIAT_API_KEY = '3bfc9a0ce38830e1ee147b3d'
//const FIAT_API_URL = 'https://api.exchangerate-api.com/v4/latest/'; //Заменить если закончатся запросы в новой версии


const Converter: React.FC = () => {

    const [value, setValue] = useState('10');
    const [fromCurrency, setFromCurrency] = useState<string>('RUB');
    const [toCurrency, setToCurrency] = useState<string>('USD');
    const [convertedValue, setConvertedValue] = useState<string>('');
    const [commissionRate, setCommissionRate] = useState<string>('0') 

    

    const valueChange = (value: number | null) => {
        if (value !== null)
        setValue(value.toString());
    };


    const fromCurrencyChange =  (currency: string) => {
        setFromCurrency(currency);
    };


    const toCurrencyChange = (currency: string) => {
        setToCurrency(currency);
    };

    const valueSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    }

    
    const isCrypto = (currency: string) => {
        const cryptoCurrencies = ['BTC', 'ETH', 'XRP', 'SOL', 'BNB', 'USDT', 'TON', 'TRX'];
        return cryptoCurrencies.includes(currency.toUpperCase());
    };


    useEffect(() => { //Не уверен что 2 useEffect правильно
        const fetchLocalCurrency = async () => {
            try {
                const response = await fetch("https://ipapi.co/currency/");
                const localCurrency = await response.text();

            
                setFromCurrency(localCurrency);
            } catch (error) {
                console.error("Ошибка при получении локальной валюты:", error);
            }
        };
        fetchLocalCurrency();
    },[]);

    useEffect(() => {
        
        const convertCurrency = async (fromCurrency: string, toCurrency: string, amount: number) => {
            let exchangeRate: number;
            let amountBeforeCommision: number;

            if (!isCrypto(fromCurrency) && !isCrypto(toCurrency)) {
                const response = await axios.get(`${FIAT_API_URL}/${FIAT_API_KEY}/latest/${fromCurrency}`);
                exchangeRate = response.data.conversion_rates[toCurrency];

            } else if (isCrypto(fromCurrency) && isCrypto(toCurrency)) {
                const response = await axios.get(`${CRYPTO_API_URL}/${fromCurrency}/${toCurrency}`, {
                    headers: { 'X-CoinAPI-Key': CRYPTO_API_KEY }
                });
                exchangeRate = response.data.rate;

            } else {
                const cryptoCurrency = isCrypto(fromCurrency) ? fromCurrency : toCurrency;
                const fiatCurrency = isCrypto(fromCurrency) ? toCurrency : fromCurrency;
                const response = await axios.get(`${CRYPTO_API_URL}/${cryptoCurrency}/${fiatCurrency}`, {
                    headers: { 'X-CoinAPI-Key': CRYPTO_API_KEY }
                });
                exchangeRate = response.data.rate;

                if (isCrypto(toCurrency)) {
                    exchangeRate = 1 / exchangeRate;
                }
            }
            if (Number(commissionRate) >= 0) {
                amountBeforeCommision = amount * (1 - Number(commissionRate) / 100);
            } else {
                setCommissionRate('0');
               amountBeforeCommision = amount / 100  
            } 
            const convertedAmount = amountBeforeCommision * exchangeRate;
            return convertedAmount;
        };

        const updateExchangeRates = async () => {
            if (value !== '') {
                const convertedValue = await convertCurrency(fromCurrency, toCurrency, Number(value));
                setConvertedValue(convertedValue.toFixed(3))
            } else {
                setConvertedValue('0')
            }
        }
        updateExchangeRates();
    
        const interval = setInterval(updateExchangeRates, 10000);

        return () => {
            clearInterval(interval);
        }
    },[fromCurrency,toCurrency,value, commissionRate])

    return (
         
            <div className="currencyConverter">
            <div className="inputs">

                <ValueInput
                    value={value}
                    currency={fromCurrency}
                    onValueChange={valueChange}
                    onCurrencyChange={fromCurrencyChange}

                />

                <button onClick={valueSwap} className="arrow">⇄</button>

                <ValueInput
                    value={convertedValue}
                    currency={toCurrency}
                    onValueChange={() => { }}
                    onCurrencyChange={toCurrencyChange}


                />
                <div>
                    <label htmlFor="commissionRate">Комиссия (%):</label>
                    <input
                        type="number"
                        id="commissionRate"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(e.target.value)}
                        min='0'
                        max="100"
                        step="0.1"
                    />
                </div>
            </div>

        </div>
        
    )
}
export default Converter