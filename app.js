const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const configs = require('./configs')
const Main = require('./controller/Main')
const chalk = require('chalk')
const morgan = require('morgan')
const redisService = require('./services/redis')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('./public'))

// Logger
app.use(morgan('dev'))

// Connect Mongoose
mongoose.connect(configs.mongodburl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log(chalk.cyanBright.bold('Mongodb is live!'))
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({
            error: true,
            message: 'Database doesn\'t work'
        })
    })

// Redis Service Start
redisService.init();
// Set cache (first 5 record and 1 hours exp time)
redisService.initCache(15, 3600);

// User Route
app.use('/user', require('./route/user'))
// Media Route
app.use('/media', require('./route/media'))
// Api Route
app.use('/api', require('./route/api'))
// Login Route
app.post('/login', async (req, res) => {
    let guest = await Main.login(req.body)
    try {
        if (guest.status == 200) {
            // RememberMe check
            if (req.body.rememberMe == 'true') {
                res.cookie('access_token', guest.token, {
                    maxAge: configs.cookieExpirationTimeRememberTrue,
                    httpOnly: true
                })
            } else {
                res.cookie('access_token', guest.token, {
                    maxAge: (configs.cookieExpirationTimeRememberFalse),
                    httpOnly: true
                })
            }
            delete guest.token
        }
        res.status(guest.status).json(guest)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: true,
            message: 'Cookie error'
        })
    }
})
// Register route
app.post('/register', async (req, res) => {
    let guest = await Main.register(req.body)
    res.status(guest.status).json(guest)
})
// Home route
app.get('/', (req, res) => {
    res.json( {
        "users": [],
        "_id": "5e84bf10432e470024853a16",
        "netflix_id": 80065182,
        "watch": "tv",
        "details": {
            "backdrop_path": "/6X9pyhrKSy0zEpqpBBlaLZdULLv.jpg",
            "created_by": [
                {
                    "id": 1212201,
                    "credit_id": "55fd5335c3a36813280009e9",
                    "name": "Craig Sweeny",
                    "gender": 2,
                    "profile_path": "/iRJCOxSDnhJZMKvoyt6iTcq3Qsr.jpg"
                }
            ],
            "episode_run_time": [
                45
            ],
            "first_air_date": "2015-09-22",
            "genres": [
                {
                    "id": 80,
                    "name": "Suç"
                },
                {
                    "id": 18,
                    "name": "Dram"
                },
                {
                    "id": 10765,
                    "name": "Bilim Kurgu & Fantazi"
                },
                {
                    "id": 10759,
                    "name": "Aksiyon & Macera"
                }
            ],
            "homepage": "http://www.cbs.com/shows/limitless/",
            "id": 62687,
            "in_production": false,
            "languages": [
                "en"
            ],
            "last_air_date": "2016-04-26",
            "last_episode_to_air": {
                "air_date": "2016-04-26",
                "episode_number": 22,
                "id": 1183440,
                "name": "Sezon Finali: İkinci Bölüm!",
                "overview": "NZT'nin giderek artan zararlı yan etkileriyle karşı karşıya kalan Brian, Sands yakalanıp Piper kurtarılana kadar ilacı bırakmayı reddeder.",
                "production_code": "LIM22",
                "season_number": 1,
                "show_id": 62687,
                "still_path": "/4jpKMXyF6XAVWkQ5Z5Whz7kFa3d.jpg",
                "vote_average": 7,
                "vote_count": 3
            },
            "name": "Limit Yok",
            "next_episode_to_air": null,
            "networks": [
                {
                    "name": "CBS",
                    "id": 16,
                    "logo_path": "/nm8d7P7MJNiBLdgIzUK0gkuEA4r.png",
                    "origin_country": "US"
                }
            ],
            "number_of_episodes": 22,
            "number_of_seasons": 1,
            "origin_country": [
                "US"
            ],
            "original_language": "en",
            "original_name": "Limitless",
            "overview": "2011 tarihli filmden uyarlanan dizide, başarısız müzisyen yeni bir ilaçla beyninin tüm gücünü kullanabilmeye başlar ve FBI'ın en zorlu vakalarını çözmek üzere işe alınır.",
            "popularity": 13.14,
            "poster_path": "/ieXc6ryp53DGOv9X3PFhTvTtLau.jpg",
            "production_companies": [
                {
                    "id": 7296,
                    "logo_path": null,
                    "name": "K/O Paper Products",
                    "origin_country": "US"
                },
                {
                    "id": 7295,
                    "logo_path": "/5MYE96QiE5a5oFhXxFb4y8ILSpw.png",
                    "name": "Relativity Media",
                    "origin_country": "US"
                },
                {
                    "id": 1081,
                    "logo_path": "/vfcpaPf6WktaCIHqF4FJAcek8q2.png",
                    "name": "CBS Television Studios",
                    "origin_country": "US"
                }
            ],
            "seasons": [
                {
                    "air_date": "2015-09-22",
                    "episode_count": 22,
                    "id": 66733,
                    "name": "Sezon 1",
                    "overview": "Zorlu FBI vakalarını çözmek için beyin potansiyelinin tamamını kullanmak amacıyla NZT kullanan Brian Finch, bir başka NZT kullanıcısı Senatör Morra ile gizlice buluşur.",
                    "poster_path": "/rdp0lG3hKrZMcwM3rdf5sxRObzD.jpg",
                    "season_number": 1
                }
            ],
            "status": "Canceled",
            "type": "Scripted",
            "vote_average": 7.1,
            "vote_count": 342
        },
        "credits": {
            "cast": [
                {
                    "character": "Brian Finch",
                    "credit_id": "556ed1ff925141707c00151f",
                    "id": 94791,
                    "name": "Jake McDorman",
                    "gender": 2,
                    "profile_path": "/9Gc3sRBTWtxfq6oL9AEH1K8C0o0.jpg",
                    "order": 0
                },
                {
                    "character": "Rebecca Harris",
                    "credit_id": "556ed223c3a3684796001315",
                    "id": 53828,
                    "name": "Jennifer Carpenter",
                    "gender": 1,
                    "profile_path": "/3AhL2p80FOim6qdSYO4YKp9zdxl.jpg",
                    "order": 1
                },
                {
                    "character": "Spellman Boyle",
                    "credit_id": "556ed241c3a3680ea2002b78",
                    "id": 57686,
                    "name": "Hill Harper",
                    "gender": 2,
                    "profile_path": "/bUzVvgD066zYGJ9amJzgoGivlqD.jpg",
                    "order": 2
                },
                {
                    "character": "Nasreen \"Naz\" Pouran",
                    "credit_id": "556ed233c3a3680ea2002b75",
                    "id": 1161,
                    "name": "Mary Elizabeth Mastrantonio",
                    "gender": 1,
                    "profile_path": "/g0qb8ziTfeIuaz2lDFKxEyDu3RI.jpg",
                    "order": 3
                },
                {
                    "character": "Edward Morra",
                    "credit_id": "5c6478c99251412fc4feceb7",
                    "id": 51329,
                    "name": "Bradley Cooper",
                    "gender": 2,
                    "profile_path": "/z5LUl9bljJnah3S5rtN7rScrmI8.jpg",
                    "order": 500
                },
                {
                    "character": "Dennis Finch",
                    "credit_id": "5c6478dc0e0a265627969f69",
                    "id": 12122,
                    "name": "Ron Rifkin",
                    "gender": 2,
                    "profile_path": "/hukx9wydqjFEu3xXToQWln1PMxN.jpg",
                    "order": 500
                },
                {
                    "character": "Marie Finch",
                    "credit_id": "5c6478fbc3a3681b7cda4cf2",
                    "id": 7571,
                    "name": "Blair Brown",
                    "gender": 1,
                    "profile_path": "/hnVybZLBUJNr93gCTwgRQRCkjpm.jpg",
                    "order": 500
                },
                {
                    "character": "Ike",
                    "credit_id": "5c647910c3a3684cecd6b6c2",
                    "id": 1218244,
                    "name": "Tom Degnan",
                    "gender": 0,
                    "profile_path": "/rypJaH5AWLBAGE0W1dg5DlJlrb4.jpg",
                    "order": 500
                },
                {
                    "character": "Mike",
                    "credit_id": "5c6479230e0a2625d196a644",
                    "id": 1379821,
                    "name": "Michael James Shaw",
                    "gender": 2,
                    "profile_path": "/gKqyCTNxdYo7g22fp7PjYzXQb3F.jpg",
                    "order": 500
                },
                {
                    "character": "Casey Rooks",
                    "credit_id": "5c647947c3a368745eda1cd5",
                    "id": 6365,
                    "name": "Desmond Harrington",
                    "gender": 2,
                    "profile_path": "/z9EoAcqWjPD5vPtNCRT7p8Kj6o6.jpg",
                    "order": 500
                },
                {
                    "character": "Jarrod Sands",
                    "credit_id": "5c64795cc3a368745eda1cef",
                    "id": 5414,
                    "name": "Colin Salmon",
                    "gender": 2,
                    "profile_path": "/2RHy23vEDs0JRI4uy6IXNxKOrzL.jpg",
                    "order": 500
                },
                {
                    "character": "Piper Baird",
                    "credit_id": "5c647971c3a3681b7cda4dfb",
                    "id": 127734,
                    "name": "Georgina Haig",
                    "gender": 1,
                    "profile_path": "/b9OXOhMQ6x594ZHWsx0JozA7oSO.jpg",
                    "order": 500
                },
                {
                    "character": "Rachel Finch",
                    "credit_id": "5c6479d9c3a3684cecd6b7d5",
                    "id": 1274681,
                    "name": "Megan Guinan",
                    "gender": 0,
                    "profile_path": "/tMnBkbcf2SxAa9FRkVQhleLOSMC.jpg",
                    "order": 500
                },
                {
                    "character": "James \"Tech\" Padgett",
                    "credit_id": "5c6479ee0e0a267b9095ee56",
                    "id": 1433451,
                    "name": "Michael Devine",
                    "gender": 2,
                    "profile_path": "/AiS5AgSFZlDTdFrAmOolaUXsJyy.jpg",
                    "order": 500
                }
            ]
        },
        "images": {
            "backdrops": [
                {
                    "aspect_ratio": 1.777777777777778,
                    "file_path": "/6X9pyhrKSy0zEpqpBBlaLZdULLv.jpg",
                    "height": 1080,
                    "iso_639_1": null,
                    "vote_average": 5.3125,
                    "vote_count": 1,
                    "width": 1920
                },
                {
                    "aspect_ratio": 1.777777777777778,
                    "file_path": "/3qC6Kny3p55ulSLo5R5ainfIdpG.jpg",
                    "height": 1125,
                    "iso_639_1": null,
                    "vote_average": 5.3125,
                    "vote_count": 1,
                    "width": 2000
                },
                {
                    "aspect_ratio": 1.777777777777778,
                    "file_path": "/z7Ne6xosPLTLafXdgRNk6PJD4b4.jpg",
                    "height": 1440,
                    "iso_639_1": null,
                    "vote_average": 5.171130952380953,
                    "vote_count": 1,
                    "width": 2560
                }
            ],
            "id": 62687,
            "posters": [
                {
                    "aspect_ratio": 0.66650390625,
                    "file_path": "/ieXc6ryp53DGOv9X3PFhTvTtLau.jpg",
                    "height": 2048,
                    "iso_639_1": "en",
                    "vote_average": 5.3125,
                    "vote_count": 1,
                    "width": 1365
                },
                {
                    "aspect_ratio": 0.68,
                    "file_path": "/oOd48xN91PkKO94xQXXC8g4vYfc.jpg",
                    "height": 1000,
                    "iso_639_1": "en",
                    "vote_average": 5.238095238095238,
                    "vote_count": 1,
                    "width": 680
                },
                {
                    "aspect_ratio": 0.6616666666666666,
                    "file_path": "/l3NoCa4gyAEL5U8RLa5LQqfEGiG.jpg",
                    "height": 3000,
                    "iso_639_1": "en",
                    "vote_average": 5.223214285714286,
                    "vote_count": 1,
                    "width": 1985
                },
                {
                    "aspect_ratio": 0.6666666666666666,
                    "file_path": "/mioqdGS6r5aCfvSdKa4oadHqr8W.jpg",
                    "height": 900,
                    "iso_639_1": "en",
                    "vote_average": 5.223214285714286,
                    "vote_count": 1,
                    "width": 600
                },
                {
                    "aspect_ratio": 0.66650390625,
                    "file_path": "/6JllegfR7Bvu2Ds7fWwyDTWumrA.jpg",
                    "height": 2048,
                    "iso_639_1": "en",
                    "vote_average": 5.171130952380953,
                    "vote_count": 1,
                    "width": 1365
                },
                {
                    "aspect_ratio": 0.6672932330827067,
                    "file_path": "/7BEHqYAvYrz2BPxItERtIHwBN8Q.jpg",
                    "height": 1596,
                    "iso_639_1": "en",
                    "vote_average": 0,
                    "vote_count": 0,
                    "width": 1065
                },
                {
                    "aspect_ratio": 0.6666666666666666,
                    "file_path": "/jdhvUXqFrERodWpEvXs7AbuL0mr.jpg",
                    "height": 2700,
                    "iso_639_1": "en",
                    "vote_average": 0,
                    "vote_count": 0,
                    "width": 1800
                }
            ]
        },
        "trailers": {
            "id": 62687,
            "results": [
                {
                    "id": "556ed1c0c3a3680ea2002b68",
                    "iso_639_1": "en",
                    "iso_3166_1": "US",
                    "key": "QqMe6pwSfIE",
                    "name": "LIMITLESS Season 1 TRAILER (2015) | New CBS Series First Look HD",
                    "site": "YouTube",
                    "size": 720,
                    "type": "Trailer"
                }
            ]
        }
    })
})
// Server Listening
app.listen(process.env.PORT || configs.port, () => { console.log(chalk.yellowBright.bold.bgGreen('Listening: ' + configs.port)) })
// Error Handling
app.on('eror', (error) => { console.log(error) })