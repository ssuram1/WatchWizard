if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
//import express
const express = require('express');
//import axios
const axios = require('axios');
//import mssql Node.js package
const sql = require('mssql');
//import SQL configuration
const sqlConfig = require('./dbConfig');
//import passport.js
const passport = require('passport');
//import express-flash
const flash = require('express-flash');
//import express-session
const session = require('express-session');
//import cors
const cors = require('cors');
//import method-override
const methodOverride = require('method-override')


//create instance of express application
const app = express()
//server is on port 3000
const PORT = 3000
//API key
const apiKey = 'JpBbPVPOSNMKtcetkkLkw3ATm4MMNj55jNT1ZMFV'
//use CORS to allow all origins
app.use(cors());

//use express.json middleware
app.use(express.json());
//middleware setup
app.set('view engine', 'ejs')
//access registration details in req
app.use(express.urlencoded({extended:false}))
//use for flashing messages
app.use(flash())
//use to track user sessions
app.use(session ({
    //secret key
    secret: process.env.SESSION_SECRET,
    //no resave if no change
    resave: false, 
    //no saving empty values
    saveUnitialized: false
}))
//initializes passport
app.use(passport.initialize())
//store variables to persist across whole user session
app.use(passport.session())
//import to override POST method and use delete method
app.use(methodOverride('_method'))


//route to render registration page
app.get("/register",checkNotAuthenticated , (req, res) => {
    res.render('register.ejs')
})
//when POST request to /register endpoint, add to DB
//async function ensures that await until password is hashed
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        //ensure password is hashed
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //add user object to array--CHANGE to add to DB
        users.push({
            id: Date.now().toString(),
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword
        });
        //express.js method to redirect client to login page
        res.redirect('/login');
    }
    catch {
        res.redirect('/register');
    }
    console.log(users);
})

//use to log out of sesion
app.delete('/logout', (req, res) => {
    //passport method to clear session and log user out
    req.logout((err) => {
        if(err) {
            return next(err)
        }
        res.redirect('/login')
    });
});

//route to render login page
app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
});
//when POST request to /login endpoint, use passport authentication middleware
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}
));

//middleware function to ensure user authentication prior to access
function checkAuthenticated(req, res, next) {
    //checks for authentication
    if (req.isAuthenticated()) {
        return next()
    }
    //if not authenticated, redirect to login page
    return res.redirect('/login')
}

//middleware function to ensure no access to login/registration if already authenticated
function checkNotAuthenticated(req, res, next) {
    //checks if authenticated and redirect to home page
    if (req.isAuthenticated()) {
        return res.redirect('/home')
    }
    //if not authenticated, continue
    next()
}


//static file serving configuration
app.use(express.static('public')); 


//req is HTTP request, res is HTTP response- temp
app.get("/home", checkAuthenticated, (req, res) => {
    //personalize message to authenticated user
    //for future after creating angular page, change to res.render('filename', {name: req.user.firstname})
    res.render('index.ejs')
})


//use express.json middleware
app.use(express.json());
//middleware setup
app.set('view engine', 'ejs')
//access registration details in req
app.use(express.urlencoded({extended:false}))
//use for flashing messages
app.use(flash())
//use to track user sessions
app.use(session ({
    //secret key
    secret: process.env.SESSION_SECRET,
    //no resave if no change
    resave: false, 
    //no saving empty values
    saveUnitialized: false
}))

//import to override POST method and use delete method
app.use(methodOverride('_method'))

//static file serving configuration
app.use(express.static('public')); 

//connect to SQL Server
sql.connect(sqlConfig).then(pool => {   
    if (pool.connected) {
        console.log('Connected to SQL Server');
    }

//watchmode API Routes
    //route to listen for GET request for Movies page
    app.get('/api/movies', async(req, res) => {
        const {genre} = req.query;
        try {
                //use connection from pool to send search request to database
                let result = await pool.request()
                //query databases for list movies
                .query(`select * from content where type = 'movie' and genre = '${genre}'`);
                res.json(result.recordset);
                // // if(result.recordset.length < 2) {
                //         //use axios library to send HTTP GET request to Watchmode; await because async and wait for response
                //         const response = await axios.get('https://api.watchmode.com/v1/list-titles', {
                //             //parameters for GET request
                //             params: {
                //                 apiKey: apiKey,
                //                 types: 'movie',
                //                 limit: 10,
                //                 genres: '14'
                //             }
                //         });
                //         //retrieve tvshow list
                //         const movieList = response.data.titles || [];
                //         if(movieList.length === 0) {
                //             return res.status(404).send('No movies found');
                //         }
                //         const length = movieList.length;
                //         console.log(length);
                //         //loop through each of the fetched movies, find details, and add details to DB
                //         for (const result of movieList) {
                //                 try {
                //                     //call title API endpoint to fetch details for each title
                //                     const detailsResponse = await axios.get(`http://localhost:3000/api/title/${result.id}`, {
                //                         params: {apiKey: apiKey}
                //                 });
                                
                //                 //retrieve data
                //                 const content = detailsResponse.data;
                //                 console.log("ContentID: " + content.id);

                //                 // retrieve first genre if genre_names is an array
                //                 const firstGenre = content.genre_names && content.genre_names.length > 0 ? content.genre_names[0] : 'Unknown';
                //                 console.log(firstGenre);
                //                 // new request for connection from pool to run SQL query
                //                 const insertedContent = await pool.request()
                //                 // creates inputs for request (parameterName, sqlType, value)
                //                     .input('watchmodeID', sql.Int, content.id)
                //                     .input('plot_overview', sql.VarChar, content.plot_overview)
                //                     .input('title', sql.VarChar, content.title) 
                //                     .input('type', sql.VarChar, content.type)
                //                     .input('year', sql.Int, content.year)
                //                     .input('genre', sql.VarChar, firstGenre) //take first genre in list
                //                     .input('us_rating', sql.VarChar, content.us_rating) 
                //                     .input('poster', sql.VarChar, content.poster)
                //                     .input('backdrop', sql.VarChar, content.backdrop)
                //                     .input('original_language', sql.VarChar, content.original_language)
                //                     .input('trailer', sql.VarChar, content.trailer)
                //                     .input('trailer_thumbnail', sql.VarChar, content.trailer_thumbnail)
                //                     .input('user_rating', sql.Float, content.user_rating)
                //                     .query(`
                //                             IF NOT EXISTS (SELECT 1 FROM content WHERE watchmodeID = @watchmodeID)
                //                             BEGIN
                //                                 INSERT INTO content (watchmodeID, plot_overview, title, type, year, genre, us_rating, poster, backdrop, original_language, trailer, trailer_thumbnail, user_rating) 
                //                                 OUTPUT inserted.contentID
                //                                 VALUES (@watchmodeID, @plot_overview, @title, @type, @year, @genre, @us_rating, @poster, @backdrop, @original_language, @trailer, @trailer_thumbnail, @user_rating);
                //                             END;
                //                         `
                //                     );      

                //                 //iterate through sources list for this result if exists
                //                 if(insertedContent.recordset) {
                //                     console.log("Sources: " + insertedContent.recordset);
                //                     const contentID = insertedContent.recordset[0].contentID;

                //                     for (const source of content.sources) {
                //                         await pool.request()
                //                         .input('sourceName', sql.VarChar, source.name)
                //                         .input('sourceURL', sql.VarChar, source.web_url)
                //                         .input('region', sql.VarChar, source.region)
                //                         .input('seasons', sql.Int, source.seasons)
                //                         .input('episodes', sql.Int, source.episodes)
                //                         .input('contentID', sql.Int, contentID)
                //                         .query(`IF NOT EXISTS (SELECT 1 FROM source WHERE contentID = @contentID)
                //                                 INSERT INTO source(contentID, sourceName, sourceURL, region, seasons, episodes)
                //                                 VALUES(@contentID, @sourceName, @sourceURL, @region, @seasons, @episodes)`)
                //                     }
                //                 } 
                //             }   
                //             catch(error) {
                //                 console.error("Error fetching details", error);
                //             }
                //         }
                //     res.json(response.data);
            //  }
        }
        //catches errors during API requests
        catch (error) {
            console.error('Error fetching movies list', error);
            res.status(500).send('Error fetching movies');
        }
    });

    //route to listen for GET request for TV Shows page
    app.get('/api/tvshows', async(req, res) => {
        const {genre} = req.query;
        try {
            //  use connection from pool to send search request to database
             let result = await pool.request()
             //query databases for list movies
             .query(`select * from content where type = 'tv_series' and genre = '${genre}'`);
             res.json(result.recordset);
            //  if(result.recordset.length < 2) {
                // //use axios library to send HTTP GET request to Watchmode; await because async and wait for response
                // const response = await axios.get('https://api.watchmode.com/v1/list-titles', {
                //     //parameters for GET request
                //     params: {
                //         apiKey: apiKey,
                //         types: 'tv_series',
                //         limit: 10,
                //         genres: '39'
                //     }
                // });
                // //retrieve tvshow list
                // const movieList = response.data.titles || [];
                // if(movieList.length === 0) {
                //     return res.status(404).send('No tv shows found');
                // }
                // const length = movieList.length;
                // console.log(length);
                // //loop through each of the fetched movies, find details, and add details to DB
                // for (const result of movieList) {
                    //     try {
                    //         //call title API endpoint to fetch details for each title
                    //         const detailsResponse = await axios.get(`http://localhost:3000/api/title/${result.id}`, {
                    //             params: {apiKey: apiKey}
                    //       });
                        
                    //     //retrieve data
                    //     const content = detailsResponse.data;
                    //     console.log("ContentID: " + content.id);

                    //     // retrieve first genre if genre_names is an array
                    //     const firstGenre = content.genre_names && content.genre_names.length > 0 ? content.genre_names[0] : 'Unknown';
                    //     console.log(firstGenre);
                    //     // new request for connection from pool to run SQL query
                    //     const insertedContent = await pool.request()
                    //     // creates inputs for request (parameterName, sqlType, value)
                    //         .input('watchmodeID', sql.Int, content.id)
                    //         .input('plot_overview', sql.VarChar, content.plot_overview)
                    //         .input('title', sql.VarChar, content.title) 
                    //         .input('type', sql.VarChar, content.type)
                    //         .input('year', sql.Int, content.year)
                    //         .input('genre', sql.VarChar, firstGenre) //take first genre in list
                    //         .input('us_rating', sql.VarChar, content.us_rating) 
                    //         .input('poster', sql.VarChar, content.poster)
                    //         .input('backdrop', sql.VarChar, content.backdrop)
                    //         .input('original_language', sql.VarChar, content.original_language)
                    //         .input('trailer', sql.VarChar, content.trailer)
                    //         .input('trailer_thumbnail', sql.VarChar, content.trailer_thumbnail)
                    //         .input('user_rating', sql.Float, content.user_rating)
                    //         .query(`
                    //                 IF NOT EXISTS (SELECT 1 FROM content WHERE watchmodeID = @watchmodeID)
                    //                 BEGIN
                    //                     INSERT INTO content (watchmodeID, plot_overview, title, type, year, genre, us_rating, poster, backdrop, original_language, trailer, trailer_thumbnail, user_rating) 
                    //                     OUTPUT inserted.contentID
                    //                     VALUES (@watchmodeID, @plot_overview, @title, @type, @year, @genre, @us_rating, @poster, @backdrop, @original_language, @trailer, @trailer_thumbnail, @user_rating);
                    //                 END;
                    //             `
                    //         );      

                    //     //iterate through sources list for this result if exists
                    //     if(insertedContent.recordset) {
                    //         console.log("Sources: " + insertedContent.recordset);
                    //         const contentID = insertedContent.recordset[0].contentID;

                    //         for (const source of content.sources) {
                    //             await pool.request()
                    //             .input('sourceName', sql.VarChar, source.name)
                    //             .input('sourceURL', sql.VarChar, source.web_url)
                    //             .input('region', sql.VarChar, source.region)
                    //             .input('seasons', sql.Int, source.seasons)
                    //             .input('episodes', sql.Int, source.episodes)
                    //             .input('contentID', sql.Int, contentID)
                    //             .query(`IF NOT EXISTS (SELECT 1 FROM source WHERE contentID = @contentID)
                    //                     INSERT INTO source(contentID, sourceName, sourceURL, region, seasons, episodes)
                    //                     VALUES(@contentID, @sourceName, @sourceURL, @region, @seasons, @episodes)`)
                    //          }
                    //     }
                //     }   
                //     catch(error) {
                //         console.error("Error fetching details", error);
                //     }
                // }
             //send results to client
            //  res.json(response.data);
        }
        //catches errors during API requests
        catch (error) {
            console.error('Error fetching movies list', error);
            res.status(500).send('Error fetching movies');
        }
    });

    //route to listen for GET request for search
    app.get('/api/search', async(req, res) => {
        const {search_value, search_field} = req.query;
        try {
            //use connection from pool to send search request to database
            let result = await pool.request()
            //create input parameter for SQL query(param_name, type, value to pass)
            .input('search_value', sql.VarChar, `${search_value}%`)
            .query(`select * from content where title like @search_value`);
            
            //result's recordset array contains all result objects
            if (result.recordset.length > 0) {
                //sends response of fetched data to client
                res.json(result.recordset);
            } 
            else {
                //use axios library to send HTTP GET request to Watchmode; await because async and wait for response
                const response = await axios.get('https://api.watchmode.com/v1/search', {
                    //parameters for GET request
                    params: {
                        apiKey: apiKey,
                        search_field: search_field,
                        search_value: search_value
                    }
                });

                //store top 3 results from fetched data
                const contentList = response.data.title_results.slice(0,3);
                console.log(contentList); //remove

                //loop through each of the 3 fetched results and add details to DB
                for (const result of contentList) {
                    try {
                            //call title API endpoint to fetch details for each title
                            const detailsResponse = await axios.get(`http://localhost:3000/api/title/${result.id}`, {
                                params: {apiKey: apiKey}
                        });
                        
                        //retrieve data
                        const content = detailsResponse.data;
                        console.log(content); //remove

                        // retrieve first genre if genre_names is an array
                        const firstGenre = content.genre_names && content.genre_names.length > 0 ? content.genre_names[0] : 'Unknown';
                        console.log(firstGenre); //remove 
                    

                        // new request for connection from pool to run SQL query
                        const insertedContent = await pool.request()
                        // creates inputs for request (parameterName, sqlType, value)
                            .input('watchmodeID', sql.Int, content.id)
                            .input('plot_overview', sql.VarChar, content.plot_overview)
                            .input('title', sql.VarChar, content.title) 
                            .input('type', sql.VarChar, content.type)
                            .input('year', sql.Int, content.year)
                            .input('genre', sql.VarChar, firstGenre) //take first genre in list
                            .input('us_rating', sql.VarChar, content.us_rating) 
                            .input('poster', sql.VarChar, content.poster)
                            .input('backdrop', sql.VarChar, content.backdrop)
                            .input('original_language', sql.VarChar, content.original_language)
                            .input('trailer', sql.VarChar, content.trailer)
                            .input('trailer_thumbnail', sql.VarChar, content.trailer_thumbnail)
                            .input('user_rating', sql.Float, content.user_rating)
                            .query(`IF NOT EXISTS (SELECT 1 FROM source WHERE watchmodeID = @watchmodeID)
                                    INSERT INTO content (watchmodeID, plot_overview, title, type, year, genre, us_rating, poster, backdrop, original_language, trailer, trailer_thumbnail, user_rating) 
                                    OUTPUT inserted.contentID
                                    VALUES (@watchmodeID, @plot_overview, @title, @type, @year, @genre, @us_rating, @poster, @backdrop, @original_language, @trailer, @trailer_thumbnail, @user_rating)`);
                        
                        const contentID = insertedContent.recordset[0].contentID;
                        console.log(contentID);
                        //iterate through sources list for this result if exists
                        if(content.sources) {
                            for (const source of content.sources) {
                                await pool.request()
                                .input('sourceName', sql.VarChar, source.name)
                                .input('sourceURL', sql.VarChar, source.web_url)
                                .input('region', sql.VarChar, source.region)
                                .input('seasons', sql.Int, source.seasons)
                                .input('episodes', sql.Int, source.episodes)
                                .input('contentID', sql.Int, contentID)
                                .query(`IF NOT EXISTS (SELECT 1 FROM source WHERE contentID = @contentID)
                                    INSERT INTO source(contentID, sourceName, sourceURL, region, seasons, episodes)
                                    VALUES(@contentID, @sourceName, @sourceURL, @region, @seasons, @episodes)`)
                             }
                        } 
                    }   
                    catch(error) {
                        console.error(`Error fetching details for ID ${result.id}`, error);
                    }
                }
                //query database with newly added content
                result = await pool.request()
                    .input('search_value', sql.VarChar, `%${search_value}%`)
                    .query(`select * from content where title like @search_value`);
                res.json(result.recordset);
            }
        }
        //catches errors during API requests
        catch (error) {
            console.error('Error fetching search request', error);
            res.status(500).send('Error fetching search request');
        }
    });

     // Route to listen for GET request for persons
     app.get('/api/title/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const response = await axios.get(`https://api.watchmode.com/v1/title/${id}/details/`, {
                params: { 
                    apiKey: apiKey,
                    append_to_response: 'sources'
                }
            });
            res.json(response.data);
        } catch (error) {
            console.error(`Error fetching person details for ID ${id}`, error);
            res.status(500).send(`Error fetching person details for ID ${id}`);
        }
    });
    
    // Route to listen for GET request for persons
    app.get('/api/person/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const response = await axios.get(`https://api.watchmode.com/v1/person/${id}`, {
                params: { apiKey: apiKey }
            });
            res.json(response.data);
        } catch (error) {
            console.error(`Error fetching person details for ID ${id}`, error);
            res.status(500).send(`Error fetching person details for ID ${id}`);
        }
    });

    //Route to listen for GET request for content card/details
    app.get('/api/details', async(req, res) => {
        const {contentID} = req.query;
        try {
            //  use connection from pool to send search request to database
             let result = await pool.request()
             //query databases for movie details
             .query(`select c.contentID, c.watchmodeID, c.plot_overview, c.title, c.type, c.year, c.genre, c.us_rating, c.poster, c.backdrop, c.original_language, c.trailer, c.trailer_thumbnail, c.user_rating, s.sourceName, s.sourceURL, s.region, s.seasons, s.episodes
                     from content c full outer join source s on c.contentID = s.contentID where c.contentID = '${contentID}'`);
             res.json(result.recordset);
        }
        //catches errors during API requests
        catch (error) {
            console.error('Error fetching movies list', error);
            res.status(500).send('Error fetching movies');
        }
    });

    
    // Start server and listen for incoming requests
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    
// Catch error and report if database connection failed
}).catch(err => {
    console.error('Database connection failed', err);
});