const express = require('express');
const router = express.Router();
const db = require('../db');
const paginate = require('../lib/paginate');
const pick = require('lodash.pick');
const asyncMiddleware = require('../lib/asyncMiddleware');

// Create a Record
router.post('/', asyncMiddleware(async (req, res) => {
  const item = await db.table('title')
    .insert(req.query);

  res.status(201).send(item);
}));

// Browse Records
router.get('/', asyncMiddleware(async (req, res) => {
  const collection = await paginate(db.table('title').where(function(q) {
    if (req.query.search) {
      q.where('title.title_name', 'ILIKE', `%${req.query.search}%`);
    }
  }), pick(req.query, ['per_page', 'page']));

  res.status(200).send(collection)
}));

// Retrieve a specific Record
router.get('/:id', asyncMiddleware(async (req, res) => {
  const item = await db.table('title').where('id', req.params.id).first();

  // @todo use a library or seperate routes for loading in these relations
  item.awards = await db.table('award')
    .where('title_id', req.params.id);
  item.storylines = await db.table('storyline')
    .where('title_id', req.params.id);
  item.participants = await db.table('participant')
    .whereIn('id', q => q.from('title_participant').select('title_participant.participant_id').where('title_id', req.params.id));
  item.other_names = await db.table('other_name')
    .where('title_id', req.params.id);
  item.genres = await db.table('genre')
    .whereIn('id', q => q.from('title_genre').select('title_genre.genre_id').where('title_id', req.params.id));

  res.status(200).send(item)
}));

// Delete a specific Record
router.delete('/:id', asyncMiddleware(async (req, res) => {
  await db.table('title')
    .where('id', req.params.id)
    .delete();
  res.status(202).send({ message: "Resource deleted."})
}));

// Update a specific Record
router.put('/:id', asyncMiddleware(async (req, res) => {
  const item = await db.table('title')
    .where('id', req.params.id)
    .update(req.query);
  res.status(200).send(item)
}));

module.exports = router;
