const urls = require("../data/urls-data");
const usesController = require("../uses/uses.controller");

// GLOBALS
//--------------------------------
let lastUrlId = urls.reduce((maxId, url) => Math.max(maxId, url.id), 0)

// SERVER METHODS
//---------------------------------
function read(req, res, next) {
    const { urlId } = req.params;
    usesController.create(urlId, res);
    res.json({ data: res.locals.url });
  };
 

function list(req, res) {
    res.json({ data: urls });
}

function create(req, res) {
    const { data: { href } = {} } = req.body;
    const newUrl = {
      id: ++lastUrlId, // Increment last id then assign as the current ID
      href,
    };
  
    urls.push(newUrl);
    res.status(201).json({ data: newUrl });
  }
  
  function update(req, res) {
    const url = res.locals.url;
    const { data: { href } = {} } = req.body;
  
    // Update the paste
    url.href = href;
  
    res.json({ data: url });
  }

/*
function destroy(req, res){
    const { urlId } = req.params;
    const index = urls.findIndex((url) => url.id === Number(urlId));
  
    // `splice()` returns an array of the deleted elements, even if it is one element
    const deletedUrls = urls.splice(index, 1);
    res.sendStatus(204); 
}
*/

// VALIDATION FUNCTIONS
//-----------------------------------

function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({ status: 400, message: `Must include a ${propertyName}` });
    };
  }
  
function urlExists(req, res, next) {
    const { urlId } = req.params;
    const foundUrl = urls.find(url => url.id === Number(urlId));
    if (foundUrl) {
      res.locals.url = foundUrl;
      return next();
    }
    next({
      status: 404,
      message: `URL id not found: ${urlId}`,
    });
  };
  
  module.exports = { read: [urlExists, read], 
        list,
        create: [bodyDataHas("href"), create],
        update: [urlExists, update],
        urlExists
  };

