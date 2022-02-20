import React, { useEffect, useState, useRef } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import AutorenewIcon from '@mui/icons-material/Autorenew';

const currentYear = new Date().getFullYear();
const monthsArr = Array.from({ length: 12 }, (x, i) => {
    const month = i + 1;
    return month <= 9 ? '0' + month : month;
});
const yearsArr = Array.from({ length: 9 }, (_x, i) => currentYear + i);

export default function CForm({
    cardMonth,
    cardYear,
    onUpdateState,
    cardNumberRef,
    cardHolderRef,
    cardDateRef,
    onCardInputFocus,
    onCardInputBlur,
    cardCvvRef,
    isCardFlipped,
    cardCvv,
    children
}) {
    const [cardNumber, setCardNumber] = useState('');

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        onUpdateState(name, value);
    };

    const onCardNumberChange = (event) => {
        let { value, name } = event.target;
        let cardNumber;

        value = value.replace(/\D/g, '');
        if (/^\d{0,16}$/.test(value) && (/^$|(4)/.test(value))) {
            // for visa
            cardNumber = value
                .replace(/(\d{4})/, '$1 ')
                .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
                .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
        }
        else  if (/^\d{0,16}$/.test(value) && (/^$|(5)/.test(value))) {
            // for mastercard
            cardNumber = value
                .replace(/(\d{4})/, '$1 ')
                .replace(/(\d{4}) (\d{4})/, '$1 $2 ')
                .replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ')
        }

        setCardNumber(cardNumber.trimRight());
        onUpdateState(name, cardNumber);
    };

    const rotateButton = (event) => {
        if (isCardFlipped)
            onUpdateState('isCardFlipped', false);
        else{
            onUpdateState('isCardFlipped', true);
        }
        console.log(isCardFlipped);
    };



    const submit = async (event) => {
        const response = await fetch('https://mocki.io/v1/a5ae8585-b42d-486b-a4ff-25ebfebbaddf');
        const data = await response.json();
        for (var i = 0; i < data.length; i++){
            console.log(data[i].number);
            if (data[i].number == cardNumber.replace(/\s/g, "")){
                if (data[i].ccv == cardCvv){
                    if (data[i].exp == (cardMonth.concat("/",cardYear.substring(2)))){
                        console.log("Kart bulundu");
                        const MySwal = withReactContent(Swal)
                        await MySwal.fire({
                            title: <strong>Good job!</strong>,
                            html: <i>Payment is success!</i>,
                            icon: 'success'
                        })

                    }
                }
            }
        }
    };

    return (
        <div className="card-form">
            <div className="card-list">{children}</div>
            <div className="card-form__inner">
                <AutorenewIcon fontSize="large" className="material-icons" onClick={rotateButton}></AutorenewIcon>
                <div className="card-input">
                    <label htmlFor="cardNumber" className="card-input__label">
                        Card Number
                    </label>
                    <input
                        type="tel"
                        name="cardNumber"
                        className="card-input__input"
                        autoComplete="off"
                        onChange={onCardNumberChange}
                        maxLength="19"
                        ref={cardNumberRef}
                        onFocus={(e) => onCardInputFocus(e, 'cardNumber')}
                        onBlur={onCardInputBlur}
                        value={cardNumber}
                    />
                </div>

                <div className="card-input">
                    <label htmlFor="cardName" className="card-input__label">
                        Card Holder
                    </label>
                    <input
                        type="text"
                        className="card-input__input"
                        autoComplete="off"
                        name="cardHolder"
                        onChange={handleFormChange}
                        ref={cardHolderRef}
                        onFocus={(e) => onCardInputFocus(e, 'cardHolder')}
                        onBlur={onCardInputBlur}
                    />
                </div>

                <div className="card-form__row">
                    <div className="card-form__col">
                        <div className="card-form__group">
                            <label
                                htmlFor="cardMonth"
                                className="card-input__label"
                            >
                                Expiration Date
                            </label>
                            <select
                                className="card-input__input -select"
                                value={cardMonth}
                                name="cardMonth"
                                onChange={handleFormChange}
                                ref={cardDateRef}
                                onFocus={(e) => onCardInputFocus(e, 'cardDate')}
                                onBlur={onCardInputBlur}
                            >
                                <option value="" disabled>
                                    Month
                                </option>

                                {monthsArr.map((val, index) => (
                                    <option key={index} value={val}>
                                        {val}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="cardYear"
                                className="card-input__input -select"
                                value={cardYear}
                                onChange={handleFormChange}
                                onFocus={(e) => onCardInputFocus(e, 'cardDate')}
                                onBlur={onCardInputBlur}
                            >
                                <option value="" disabled>
                                    Year
                                </option>

                                {yearsArr.map((val, index) => (
                                    <option key={index} value={val}>
                                        {val}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="card-form__col -cvv">
                        <div className="card-input">
                            <label
                                htmlFor="cardCvv"
                                className="card-input__label"
                            >
                                CVV
                            </label>
                            <input
                                type="tel"
                                className="card-input__input"
                                maxLength="3"
                                autoComplete="off"
                                name="cardCvv"
                                onChange={handleFormChange}
                                ref={cardCvvRef}
                                value={cardCvv}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={submit} className="card-form__button">PAYMENT</button>
        </div>
    );
}
