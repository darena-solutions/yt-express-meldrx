const express = require('express')
const app = express()

const {auth, requiresAuth} = require('express-openid-connect');

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(
    auth(
        {
            authRequired: false,
            auth0Logout: true,
            baseURL: 'http://localhost:3000',
            clientID: '00fc9606014144db902841ba222072c3',
            clientSecret: 'ZDrHjkxnB5GdIXO2oYNiYFnySWh8_4',
            issuerBaseURL: 'https://app.meldrx.com',
            secret: 'n98549un8mv4t3mu8-4vgr3ti90-m,fr4cg2i9,0rf23murc2g4ny9g',
            authorizationParams: {
                scope: 'openid profile patient/*.*',
                audience: 'https://app.meldrx.com/api/fhir/379338f2-019e-4e37-a2d5-0ed051c4f942',
                response_type: 'code'
            }
        }
    )
);

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.accessToken.access_token));
});

app.get('/get', requiresAuth(), async (req, res) => {
    const accessToken = req.oidc.accessToken.access_token;
    const response = await fetch(
        `https://app.meldrx.com/api/fhir/379338f2-019e-4e37-a2d5-0ed051c4f942/Patient/${req.query.id}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        }
    )

    const text = await  response.text()

    res.send(text);
});

app.get('/create', requiresAuth(), async (req, res) => {
    const accessToken = req.oidc.accessToken.access_token;
    const response = await fetch(
        'https://app.meldrx.com/api/fhir/379338f2-019e-4e37-a2d5-0ed051c4f942/Patient',
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "resourceType": "Patient",
                "id": "example",
                "text": {
                    "status": "generated",
                    "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">\n\t\t\t<table>\n\t\t\t\t<tbody>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>Name</td>\n\t\t\t\t\t\t<td>Peter James \n              <b>Chalmers</b> (&quot;Jim&quot;)\n            </td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>Address</td>\n\t\t\t\t\t\t<td>534 Erewhon, Pleasantville, Vic, 3999</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>Contacts</td>\n\t\t\t\t\t\t<td>Home: unknown. Work: (03) 5555 6473</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>Id</td>\n\t\t\t\t\t\t<td>MRN: 12345 (Acme Healthcare)</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</tbody>\n\t\t\t</table>\n\t\t</div>"
                },
                "identifier": [
                    {
                        "use": "usual",
                        "type": {
                            "coding": [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                                    "code": "MR"
                                }
                            ]
                        },
                        "system": "urn:oid:1.2.36.146.595.217.0.1",
                        "value": "12345",
                        "period": {
                            "start": "2001-05-06"
                        },
                        "assigner": {
                            "display": "Acme Healthcare"
                        }
                    }
                ],
                "active": true,
                "name": [
                    {
                        "use": "official",
                        "family": "Chalmers",
                        "given": [
                            "Peter",
                            "James"
                        ]
                    },
                    {
                        "use": "usual",
                        "given": [
                            "Jim"
                        ]
                    },
                    {
                        "use": "maiden",
                        "family": "Windsor",
                        "given": [
                            "Peter",
                            "James"
                        ],
                        "period": {
                            "end": "2002"
                        }
                    }
                ],
                "telecom": [
                    {
                        "use": "home"
                    },
                    {
                        "system": "phone",
                        "value": "(03) 5555 6473",
                        "use": "work",
                        "rank": 1
                    },
                    {
                        "system": "phone",
                        "value": "(03) 3410 5613",
                        "use": "mobile",
                        "rank": 2
                    },
                    {
                        "system": "phone",
                        "value": "(03) 5555 8834",
                        "use": "old",
                        "period": {
                            "end": "2014"
                        }
                    }
                ],
                "gender": "male",
                "birthDate": "1974-12-25",
                "_birthDate": {
                    "extension": [
                        {
                            "url": "http://hl7.org/fhir/StructureDefinition/patient-birthTime",
                            "valueDateTime": "1974-12-25T14:35:45-05:00"
                        }
                    ]
                },
                "deceasedBoolean": false,
                "address": [
                    {
                        "use": "home",
                        "type": "both",
                        "text": "534 Erewhon St PeasantVille, Rainbow, Vic  3999",
                        "line": [
                            "534 Erewhon St"
                        ],
                        "city": "PleasantVille",
                        "district": "Rainbow",
                        "state": "Vic",
                        "postalCode": "3999",
                        "period": {
                            "start": "1974-12-25"
                        }
                    }
                ],
                "contact": [
                    {
                        "relationship": [
                            {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v2-0131",
                                        "code": "N"
                                    }
                                ]
                            }
                        ],
                        "name": {
                            "family": "du Marché",
                            "_family": {
                                "extension": [
                                    {
                                        "url": "http://hl7.org/fhir/StructureDefinition/humanname-own-prefix",
                                        "valueString": "VV"
                                    }
                                ]
                            },
                            "given": [
                                "Bénédicte"
                            ]
                        },
                        "telecom": [
                            {
                                "system": "phone",
                                "value": "+33 (237) 998327"
                            }
                        ],
                        "address": {
                            "use": "home",
                            "type": "both",
                            "line": [
                                "534 Erewhon St"
                            ],
                            "city": "PleasantVille",
                            "district": "Rainbow",
                            "state": "Vic",
                            "postalCode": "3999",
                            "period": {
                                "start": "1974-12-25"
                            }
                        },
                        "gender": "female",
                        "period": {
                            "start": "2012"
                        }
                    }
                ],
                "managingOrganization": {
                    "reference": "Organization/1"
                }
            })
        }
    )

    const text = await response.text()
    res.send(text);
});

app.listen(3000, () => {
})