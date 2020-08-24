# AdyenCheckout project using Node.js + Express

After cloning or download, run `npm run start` to start the express server

There are two main routes
- http://localhost:5000/checkout to use the dropin component
- http://localhost:5000/admin to view logs of previous transactions

To see a successful payment
1. Select AUD as currency and click submit - the dropin component will load.
2. Use sample payment details in either mastercard or Poli

To see an unsuccessful payment
1. Select NL as currency and click submit - the dropin component will load.
2. Use sample payment details in either mastercard or Poli


Sample PSPs and responses:

<details>
<summary>PSP 853598273403390C (mastercard)</summary>
<br>
{
  "paymentMethods": {
    "request": {
      "merchantAccount": "AdyenRecruitmentCOM",
      "countryCode": "AU",
      "amount": {
        "currency": "AUD",
        "value": 1000
      },
      "channel": "Web",
      "shopperLocale": "en-US"
    },
    "response": {
      "groups": [
        {
          "name": "Credit Card",
          "types": [
            "visa",
            "mc",
            "amex",
            "diners",
            "discover",
            "maestro"
          ]
        }
      ],
      "paymentMethods": [
        {
          "brands": [
            "visa",
            "mc",
            "amex",
            "diners",
            "discover",
            "maestro"
          ],
          "details": [
            {
              "key": "encryptedCardNumber",
              "type": "cardToken"
            },
            {
              "key": "encryptedSecurityCode",
              "type": "cardToken"
            },
            {
              "key": "encryptedExpiryMonth",
              "type": "cardToken"
            },
            {
              "key": "encryptedExpiryYear",
              "type": "cardToken"
            },
            {
              "key": "holderName",
              "optional": true,
              "type": "text"
            }
          ],
          "name": "Credit Card",
          "type": "scheme"
        },
        {
          "name": "POLi",
          "supportsRecurring": true,
          "type": "poli"
        }
      ]
    }
  },
  "createPayment": {
    "request": {
      "amount": {
        "currency": "AUD",
        "value": 1000
      },
      "reference": "Anusha_checkoutChallenge",
      "paymentMethod": {
        "type": "scheme",
        "encryptedCardNumber": "adyenjs_0_1_25$lm6AxCzr9GKKV/iDWRMn73mxnpm4FUbheTPAN/+arH05erqJZYG9xkB9SKImDZzY4wz1O/o5O0Pn9ATZzMiKmw+RsH0nNHZGPFQHm3TQqBaETYewp5/AV26vSi6+Y9ub6sWejMDeDinB3E1KrASbH80bUKN/Srko948nBJSMihr1QuvL8xJBXUheUMTCiUQYfULsy2u3/mKhjlEFOQHQpLzRbLihXejcB2Sk8XGbgQH1s0PMaR8stZPXFw9dZuIV+NfrAm9o47BWtyV8gcEUoeti68EIEZ76UpJ+e88NJ+hAjdAdiM66qMvayAxnXpQZB7a3qjvc1MZNbujPCGhsSA==$wC6TT2DxI/wGt3mwCIFKkp9lymYIvI7rAy52cFaxTgp7yth48AEVaQa+AHDGQGksNRtPsb14glwobGuqgF4L9Uku8QFTXlrsDJNgF6ayolUFKbRNkmod/267Qd3VwjSKOMmGLw4JJnf3rIHzhbhJNxdep/QgGtM/RSsF8Ek0g7nwKx32q0n9QGcLKOvfy+FgPHNjhAg1Ql8H9avFHGOwBDl5/6u86aTpzhkbFQ6BhSi5eiQKWBZgQQ/mveWUSzHiNT5MU0WC6HztIyTFRkk8mYoJKtjVcnTQwtj3WzSOrcJh6IRnK0PGHUM+9T8gEsRDo/kO3MWs7o5fZVOrEBYPpnS391kuhf+Bjw5uMflim6XnIen6ix5+4J3sOBGYZZTqBKMOM7VFq4fL2J3h5j/ae+/ikoU6vIK+IGXjcytWXF6UvO00U9NCHGLIKKQ+Wr6RyW24iGbaVOBJdWSm5xZ2Dy+oHIpcDe4ypnc38JTaxEbhe7r1u+U0EdXKL82rPgqqKU7Zs3g/fgKkvT79pFkOqOKuJKTOsK577nB1zkj/7ryaujtshrpT/k4yeHM7kzpNjkWI3oW45iyKdTjP1nBRhf77Hmo3aB0efX/14O4Q8K5blV+78fy3rA8n/zVaFtp9AIv/6coXXNxz8KnMiyr+0Zsrjaiue0NnI9oLrsuTQnJgSaFRAn6jhd8SstXyxpIlrrYFaSbNc5rOO68Ij8N0qhkQUnasq5PuoAeJCvhWTCQ2VO7xWWQrdjAg",
        "encryptedExpiryMonth": "adyenjs_0_1_25$D9SdSl0/V56weRFs4RvaKgsWxvveskTrUmk6Re6dN6z6V1mmsqAejtkmj2krh9O59xP98EZMPj47je0FKQU/w6N/06ov9iX2pRmWFKL7B1SviuIcldxs8dvFm0ThekAIfgIHgmOn+lUg+QbyknimoF8YC9Qei9sXaJp0R9rm3sKI4AV8XZ03xcFfi5Buqagl44hATvClt/b88QGlN4J7f0ocAjj951O+a088hb4TEKzG4C5buJcBk5OsBXe0oH6rQz6g+xX9+P1h9sIVf536dCnWsn472wKay4AmJIdpYW5lopI8b5+tCHQtWuciTi6+ym+CD5twk+BpEI+Tdoq3IQ==$ZzZwg9x/TMDz6rr0Oa3zo/ahP9YhWxmz/Nsba3LhxHBKanOiWlkxprLHdxSh28GZNZo+XokGGtd+XkSEq1WVJbIOUrJUrg2RiRuh3m+Elh4T251flXkxfVLMf2GI0n9Y9UoT+rxBsv98H+h05dBFEQ9b7MF0ThbO5Oi5rhax8Ut7qMJ/P/nD5Fd5CK6dPax2Zu1dnT7mdY/HAmQwgORJSkf8L7MAvMD0IKy4QeokxjPDs+OrxCahd+kjGAUtG7ZaMTZ5trVD6BBJVzJHxbOaIfBlgWANAsE5UbOi1QaG8Fyncb5v8AiXIQMtGkrkWn0D1huWBuDZGKsgiBVh9xewxeLMJNHP6Csgw1X72/x+nNWParXDOOUGy5+L/Vo5VINkbdcV+g==",
        "encryptedExpiryYear": "adyenjs_0_1_25$hnF5YwmwCSMCnIZhzZH+kzXIF+IaJUTKC7OwWc4AV/ZuYbuyZGkiD1Btt2Gh7kIHckjWulhqkBHZovTunMChIEB0RkqQysMZOciG+3Q7Yl8+/og1OqtaiULFubfmyMDv2d6HjzUCoJo5SODtBcRkjf7YF6JdrZIrNNWCJfDRZOdzX+XtGxal2yaxXHoP46u/PZw4lXTxVLJLWpLucRYZ8GCFwDn3ZoOuai8kga9hlTc6/Cfkb0IJosSK8+SgfNk+zU0+069uKe8WwtwXpfb4HfR2tD/fE5Bb1l3uh2vT4BezRNiHuHe9h3I4hSqSwTmnGLQjVHHtsid0Ou2cLuQI2w==$qEUq3Mfluk3DgB1ick/SsHAZMrw6ez/ywSK2IRF4DQFKRypCKkMJfJ6d5Q2mrnrcJRhpNtesHd2QItmHrQdUuDX2Y+SbO6764MIDqzVxueVLAbdHuLdBrVXJcQeni6QuBJ1HSJdqNFoD+1vsqN1HuvcRfAH5YB0dmi9KSclg1+wqDQ/tnkbC4adRX7fHT0ej6oDtS0atgV+O6ToiW+ga9esgLkODTxEuZ1PJX4FWxaL7XK0CrQOPSTybwpi+kc7UWvSv0GtOu9118otooa9BEF1JCf1monx1TCMingMlxkajaQTIF3ZBjsPAzpKUxcYm7XAFDxHKaEgUVB0eb0O4KHh1j/tptKD5acbcyZFB6m57S0h0imDhVhyEdBsxz6DW/g8oKVE=",
        "encryptedSecurityCode": "adyenjs_0_1_25$RYuCq7z644//G1NjmeeolrsXWHQokFbQVXntaD3+rSzJJi9nP1/VVHkoMBg2Xg1aZT5fuEW/MeemxAw9EKioHCDFyrD7pNvQ2Ay5tobpePKXV0aRbu0YyfqvGA4SP+pADmA+e7H1KCzdjw+iE9YGmTrO/A+ZXLyWUQ2Wq5ooAtf9x3rKPjRpyiznkMq6T9vFECeqoLqpqU9oVkdGCegUjJaPT+qMLzZtyd/a+Yl8fbhyfb8dx7Jl6whf812aUOE0u7Pkfg4pTkb09nqNqF2gvSenzgd64e1nkEosC0JYrFbH9vuEtBoP7gPECMmGV4/nNrV3YvnreK3CX2tkn3vGIg==$hVUI7r3Hc3e1cxCIBiy4RAhFCQX5EnnU88IinwPSTHcIPyvdEqwwe1UeiiWltS05duhA13QJi8x58/qDaB68L3CvTLuSCpEN1izDQGM6Z1hU7gDY+b35Ba0OIoVTVpCPofzrM107oPA/3CYpPOV6ZsepiXpNn7nFGWIvsWewXbSuBGXVnToiUhm5pk60dyASZ8AthJXsM9lJe6TBpuPfafFVDpWBXmaLOj8giRVLJRnlKu3wtt5OmEwcHzbDE4A3LxKlB/AC60+pfIxdAser7dk7U+NqSFZkWizzuW04twStc9MbIQv9wFjIwrJ2nyh98+51pOvvnB+zrF/EYcZRSAtOQA/AvLZ44sxgo/MZXgeqP1rmhAtXeH+7tS+z",
        "brand": "mc"
      },
      "returnUrl": "http://localhost:5000/handleShopperRedirect",
      "merchantAccount": "AdyenRecruitmentCOM",
      "channel": "Web",
      "additionalData": {
        "allow3DS2": true
      },
      "browserInfo": {
        "acceptHeader": "*/*",
        "colorDepth": 30,
        "language": "en-US",
        "javaEnabled": false,
        "screenHeight": 900,
        "screenWidth": 1440,
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
        "timeZoneOffset": -600
      }
    },
    "response": {
      "pspReference": "853598273403390C",
      "resultCode": "Authorised",
      "amount": {
        "currency": "AUD",
        "value": 1000
      },
      "merchantReference": "Anusha_checkoutChallenge"
    }
  },
  "resultCode": "Authorised"
}
</details>


<details>
<summary>PSP 881598273115912D (poli) </summary>
<br>

{
  "paymentMethods": {
    "request": {
      "merchantAccount": "AdyenRecruitmentCOM",
      "countryCode": "AU",
      "amount": {
        "currency": "AUD",
        "value": 1000
      },
      "channel": "Web",
      "shopperLocale": "en-US"
    },
    "response": {
      "groups": [
        {
          "name": "Credit Card",
          "types": [
            "visa",
            "mc",
            "amex",
            "diners",
            "discover",
            "maestro"
          ]
        }
      ],
      "paymentMethods": [
        {
          "brands": [
            "visa",
            "mc",
            "amex",
            "diners",
            "discover",
            "maestro"
          ],
          "details": [
            {
              "key": "encryptedCardNumber",
              "type": "cardToken"
            },
            {
              "key": "encryptedSecurityCode",
              "type": "cardToken"
            },
            {
              "key": "encryptedExpiryMonth",
              "type": "cardToken"
            },
            {
              "key": "encryptedExpiryYear",
              "type": "cardToken"
            },
            {
              "key": "holderName",
              "optional": true,
              "type": "text"
            }
          ],
          "name": "Credit Card",
          "type": "scheme"
        },
        {
          "name": "POLi",
          "supportsRecurring": true,
          "type": "poli"
        }
      ]
    }
  },
  "createPayment": {
    "request": {
      "paymentData": "Ab02b4c0!BQABAgBR3EB+EVlcNEOdQJxhHpTAKg8b90/VYkTZbOQW4DwHjyNq95KcD59tbuptagiQ1QyrCEDxUPx1YnolE/qoHMD8FivHisn39IF+e1l7trXRAlTLIbQOwXDEPidScTZ8hjF2pYQJMWu7T5ikk53lNYOfakR/AEIOmYr7gQIccRld+tgwcNkaE0RIAN2YqipkwdU2CmAiW6too2FWcMSfrKbV6tl/FB2qYiNb+hbtfO5HgeXupHhnxJj1bF2kAHbtC7qSIdA/SUKZvXpQYy+/V7P+jhpOT2sUCRC74i/2K54pTvTRpDC5neJ+I3qSQHphlRd0ke3FfyEu+NGEdJ9h+np6Ih/cax8cRZjMnbk4lqyJ6JT7lRubrR/jvsOy+LviQiV4VbL6OC908o1IykJSQrI6cP27LIZSSJMyAsoWjSnm+h+h7rCGV9Sjk8e1bq9zI7smfTlCcNBA4KCEhjzrR6KZ+r+fcyLGq63xOWVElWHfvu8ESD71tVZPafwgZDXAPsLPWq6eNFWvO5gqxWokmOo1N/XBfjGYCSDTBX9yFNTlMHros+uRsJblZesJV+Y65aP03zMZYFV7g4IzAnmNRX1aXBFoSa2maQIa+ccB99aikI5s13aK6h97qYjXehjUj8thPdykEgb5Hjf31T0jNvuZBhtOEASHsBV1G9j7ANjYRRC+4eyKlWV65yE1DCgHq147AEp7ImtleSI6IkFGMEFBQTEwM0NBNTM3RUFFRDg3QzI0REQ1MzkwOUI4MEE3OEE5MjNFMzgyM0Q2OERBQ0M5NEI5RkY4MzA1REMifSTFYl8TRHyDuxRzWJo2NeBMX5rJVoe3/kl7EcF2fDJmQG0ewivyoKjgGxUsdKdHhQqLIys9VuRqzbLFXlttFXIT6c0Lamq+yklSrCwQ6AoL8W6Zcs0rtHa78wznLZJVxQjp4FOaOCwwvVr2NroRnMVpLV6jeAtFKQQnNkSCGl5InwUzZWw+1wiOGphicNJe5BkAFpKNlKGSvrLWllrtk+1lk135OX1DhImf4sMzhYgUZRdUKRvOpwuyyMZVi/voxDt26Dn9fhjjcMZdsnNUsEiQABmdQIk/L97I8qlz8rwY9D2swheoJn+zGlFjrpWGkp8BEMbhX5qR9VygwoQt//xIv8OuFYIHkKtBno3AYOgTVV7NjRilsZnRKLg84CP2UnTo8JvmL7hJPCQ+Y+RKxNkyqkE6C0STP2p1O8yDCPOI8UF0McGYZAMUT6ZcL9di4BVPHGVQNrYG16+IDo0zhas2VJKvl0ByzZOa16neOX9+jj5ubWUSzEBKthSwhU7otEcjQI3X2BGC2VPr4LwN5m7/nzepgPg8d+KHUB4OYMyfJM3BpMWl2qhta2aonxwrAgc2FAo4e70zuafrAPP8VAFhxdNgXLT0BTXuMB/OXL768ccbybY91DYHnErsDx5K+yRO+Vc3WJAVE/MtRNXjVwx9enS4qufWy5cMYlGkhyOalwkRdJ/Jtkt1vd6VZgQ8qkGil6F8CSa4Fg+kidX5wcDeq7omckQFRvRaDc7Xjd4Y9kyZ1dRFMHK2iU4KnrJogYECiBkRgilBqseNqkSVe2bxGFLEoPd+ygGRTznlQVtfYdjTRonGoL4kGCvRbnqPvOi3n9xGDc5Pwv4GmMOpQSYoHZKQG9aaYNTP6uf9R2Re",
      "details": {
        "payload": "Ab02b4c0!BQABAgAb/hw3Wn3x/SrWhtQLi/mROxn8Lqg/bwodvyAnIIN8Q2w4LRtVn3YVOa5L4oIm4b242i6pMd0VT11n8ZBnS80rtJM1RckKklzap3vX68tbbR94ghWzN8oyV3oSElEMwRi15gTPuIb6/P9EqhNwhbhWs14ouwTpJ8snRIK3xbla/QTV+IWDFk86IsAhycDM7vHSCh6r3Pl1yv87Mw68QH7tpUAfCM1z5vX6LnV0RXYvBr0BYRoY+ZlE4bqVUBRUtmUaJwVpiE2RQWRHUlv229G+IM/J6t59Wu53gv54bMBFC5CijnJhcDy+BsJA2yh4yc4ceAgP/8aNZZDBQrLD2Jo6zxaQFF9tVdYMz4fQPtKaYFU4pezWoRNNzXI8GaTnPBbNOaFjSnsp+7f6Y8ABnj3J0xmtEgoiOEIMoQlVCsETkBFNxXi7wzAKv04goJlU0EfAvKnzFYXP3LHZKR3+F9sxN37DnkDlQ6wm8gRQdsY4zEBvsL21e/PGKIPJ6DyePB4xpDv0Nxvw+blyk7N0WmejVTyTGFWdepZGqIquhYIKI91olrHRpfuAaCyvpVWWv3lBl9kiwI/lc7iHi8V2dimY2T5uPDpDo/FGtKyfKDf+deCehtYz5+KKCU+PRPIjH5imHvovfFx4fFBAeloej27UQlMOw/wq0Z1koxCowSeN8xDti2NLALijJjZ5lrHCPOnoAEp7ImtleSI6IkFGMEFBQTEwM0NBNTM3RUFFRDg3QzI0REQ1MzkwOUI4MEE3OEE5MjNFMzgyM0Q2OERBQ0M5NEI5RkY4MzA1REMifeWeIZ2mtf2uIgzrLrfcV60ovf6SYHLD+HUP/C3kO9mdZmmvgUGAkj8QAHXglJ2NNj9vO+UWnjpH5uB5YfBW/O5TkB0OgJ8chhmU13sVmVaTjAvV/vRiGP3BhmNkzL+IPorqBBGFOKtxC4YDxSyCaVhqmWeED79PcHhH9AgOpOuyC7SylzmfynnjqgFaj/TiDgfEnZ7qsaunJfskVO1YAdLYMD1A2Mn0OjNZoh26/sdV2aTqaeP45BJ5fY/glFrUkK5WYKsbiJDU9l/lg5e7QbqJ8qnpuF0nT6bdAQ=="
      }
    },
    "response": {
      "pspReference": "881598273115912D",
      "resultCode": "Authorised",
      "merchantReference": "Anusha_checkoutChallenge",
      "paymentMethod": "poli",
      "shopperLocale": "en_GB"
    }
  },
  "resultCode": "Authorised"
}
</details>
