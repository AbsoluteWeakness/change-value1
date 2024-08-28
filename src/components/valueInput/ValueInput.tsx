import React, { useEffect, useState } from "react"
import { InputNumber, Select } from "antd"
import * as images from '../../assets/images/loadImages';

import './css/ValueInput.scss'


type Currency = {
    value: string;
    label: string;
    img: string;
    flagImg?: string;
}

const fiatCurrencies: Currency[] = [
    { value: "RUB", label: 'Рубли', img: images.rubImg, flagImg:images.rubFlag},
    { value: "USD", label: 'Доллары', img:images.usdImg, flagImg:images.usdFlag},
    { value: "EUR", label: 'Евро', img:images.euroImg, flagImg:images.euroImg},
    { value: "CNY", label: 'Юань', img:images.yuanImg, flagImg:images.yuanFlag},
    { value: "TRY", label: 'Лира', img: images.liraImg, flagImg:images.liraFlag },
    { value: "MNT", label: 'Тугрик', img: images.tugrikImg, flagImg:images.tugrikFlag },
    { value: "AED", label: 'Дирхам', img: images.dirhamImg, flagImg:images.dirhamFlag },
    { value: "INR", label: 'Рупий', img: images.rupieesImg, flagImg:images.rupieesFlag },
    { value: "KZT", label: 'Тенге', img: images.tengeImg, flagImg:images.tengeFlag },
    { value: "KRW", label: 'Вона', img: images.wonImg, flagImg:images.wonFlag }
];

const cryptoCurrencies: Currency[] = [
    { value: "BTC", label: 'Bitcoin', img: images.btcImg, flagImg:images.btcImg},
    { value: "ETH", label: "Ethereum", img: images.ethImg, flagImg:images.ethImg},
    { value: "XRP", label: "Ripple", img: images.xrpImg, flagImg:images.xrpImg },
    { value: "SOL", label: "Solana", img: images.solImg, flagImg:images.solImg},
    { value: "BNB", label: "Binance Coin", img: images.bnbImg, flagImg:images.bnbImg },
    { value: "USDT", label: 'Tether', img: images.usdtImg, flagImg:images.usdtImg},
    { value: "TON", label: 'Toncoin', img: images.tonImg, flagImg:images.tonImg },
    { value: "TRX", label: 'TRON', img: images.trxImg, flagImg:images.trxImg }
];

const allCurrencies = [...fiatCurrencies, ...cryptoCurrencies]

type valueProps = {
    value: string,
    currency:string,
    onValueChange: (value: number | null) => void,
    onCurrencyChange: (currency: string) => void,
}

const ValueInput: React.FC<valueProps> = ({value, currency, onValueChange, onCurrencyChange}) => {
    const [selectedCurrency, setSelectedCurrency] = useState(currency);

    const currencyChange = (newValue: string) => {
        setSelectedCurrency(newValue)
        onCurrencyChange(newValue)
    }

    useEffect(() => {
        setSelectedCurrency(currency)
    }, [currency])

    return (
       
        <div className="valueInput">
            
            <InputNumber  value={Number(value)} onChange={(newValue) => {
                if (newValue !== undefined) {
                    onValueChange(newValue) 
                }
            }}
                min={0}
                controls={false}
                className="input"
            />
           
           
            <Select
                value={selectedCurrency} onChange={currencyChange}
                showSearch={true}  variant="filled"
            >       
                {allCurrencies.map(currency => (
                    <Select.Option
                            key={currency.value} value={currency.value}> 
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {currency.value} <img src={currency.flagImg}  alt='' style={{ width: 35, height: 35, marginLeft: 10 , }}/> - {currency.label}
                            <img src={currency.img} alt={currency.label} style={{ width: 35, height: 35, marginLeft: 10 }} /> 
                            
                        </div>
                       
                    </Select.Option>
                ))}
            </Select>
    
        </div>
    )
}

export default ValueInput