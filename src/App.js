import React, {useState, useEffect} from "react";
import './App.css';
import CurrencyRow from './CurrencyRow';

const url = 'https://api.exchangeratesapi.io/latest';


function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] =useState()
  const [toCurrency, setToCurrency] =useState()
  const [amount, setAmount] =useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] =useState(true)
  const [exchageRate, setExchageRate] = useState()
 
  let toAmount, fromAmount 
  if(amountInFromCurrency){
    fromAmount = amount
    toAmount = amount*exchageRate
  } else{
    toAmount = amount
    fromAmount = amount/exchageRate
  }

  function handleFromAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[0]
        setCurrencyOptions([data.base,  ...Object.keys(data.rates)])
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchageRate(data.rates[firstCurrency])
      })
  }, [])


  useEffect(() => { 
    if(fromCurrency != null && toCurrency != null){
    fetch(`${url}?base=${fromCurrency}&symbols=${toCurrency}`)
      .then(res => res.json())
      .then(data => setExchageRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

  return (
    <div>
      <h1>Convert</h1>
      <CurrencyRow 
        currencyOptions = {currencyOptions}
        selectedCurrency = {fromCurrency}
        onChangeCurrency = {e => setFromCurrency(e.target.value)}
        onChangeAmount = {handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions = {currencyOptions}
        selectedCurrency = {toCurrency}
        onChangeCurrency = {e => setToCurrency(e.target.value)}
        onChangeAmount = {handleToAmountChange}
        amount={toAmount}
      />
    </div>
  );
}

export default App;
