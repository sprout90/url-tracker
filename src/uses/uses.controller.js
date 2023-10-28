const uses = require("../data/uses-data");

// GLOBALS
//--------------------------------
let lastUseId = uses.reduce((maxId, use) => Math.max(maxId, use.id), 0)

// SERVER METHODS
//---------------------------------
function read(req, res, next) {
    res.json({ data: res.locals.use });
  };
 

function list(req, res) {
  const { urlId } = req.params;
  res.json({ data: uses.filter(urlId ? use => use.urlId == urlId : () => true) });
}

function create(urlId, res) {
    
    const time = Date.now();

    const newUse = {
      id: ++lastUseId, // Increment last id then assign as the current ID
      urlId: Number(urlId),
      time: time
    };
  
    uses.push(newUse);
    //res.status(201).json({ data: newUse });
  }

  function destroy(req, res){
    const { useId } = req.params;
    const index = uses.findIndex((use) => use.id === Number(useId));
  
    // `splice()` returns an array of the deleted elements, even if it is one element
    const deletedUrls = uses.splice(index, 1);
    res.sendStatus(204);
  
}

// VALIDATION FUNCTIONS
//-----------------------------------
function useExists(req, res, next) {
    const { useId } = req.params;
    const foundUse = uses.find(use => use.id === Number(useId));
    if (foundUse) {
      res.locals.use = foundUse;
      return next();
    }
    next({
      status: 404,
      message: `Use id not found: ${useId}`,
    });
  };
  
  module.exports = { read: [useExists, read], 
        list,
        create,
        delete: [useExists, destroy]

  };

