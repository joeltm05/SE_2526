const express = require('express');
const router = express.Router();
const { getAll, getOne, getFilteredData, createRow, updateRow, deleteRow } = require('../controllers');
const { validateId, validateColumn, validateBody, authenticateToken, requireAdmin, requireFormador, requireFormadorOrAdmin, checkNotf } = require('../middlewares');


// // ROTAS PÚBLICAS (sem autenticação)
// // Exemplo: Listar todos os registros de uma tabela específica pode ser público
// router.get('/public/:table', getAll);

// // ROTAS PROTEGIDAS (requerem autenticação)

// // Rota protegida básica - requer apenas autenticação
// router.get('/protected/:table',
//     authenticateToken,
//     getAll
// );

// // Rota protegida para obter um registro específico
// router.get('/protected/:table/:id',
//     authenticateToken,
//     validateId,
//     getOne
// );

// // Rota para criar - apenas utilizadores autenticados
// router.post('/protected/:table',
//     authenticateToken,
//     validateBody,
//     createRow
// );

// // Rota para atualizar - apenas utilizadores autenticados
// router.put('/protected/:table/:id',
//     authenticateToken,
//     validateId,
//     validateBody,
//     updateRow
// );

// // Rota para eliminar - apenas utilizadores autenticados
// router.delete('/protected/:table/:id',
//     authenticateToken,
//     validateId,
//     deleteRow
// );

// // ROTAS COM CONTROLO DE PERFIL

// // Apenas administradores podem criar registros em tabelas sensíveis
// router.post('/admin/:table',
//     authenticateToken,
//     requireAdmin,
//     validateBody,
//     createRow
// );

// // Apenas administradores podem eliminar registros
// router.delete('/admin/:table/:id',
//     authenticateToken,
//     requireAdmin,
//     validateId,
//     deleteRow
// );

// // Formadores podem criar e editar conteúdo de cursos
// router.post('/formador/:table',
//     authenticateToken,
//     requireFormador,
//     validateBody,
//     createRow
// );

// router.put('/formador/:table/:id',
//     authenticateToken,
//     requireFormador,
//     validateId,
//     validateBody,
//     updateRow
// );

// // Formadores ou administradores podem aceder a certas funcionalidades
// router.get('/formador-admin/:table',
//     authenticateToken,
//     requireFormadorOrAdmin,
//     getAll
// );

// ROTAS ORIGINAIS (mantidas para compatibilidade)
// NOTA: Estas rotas não têm autenticação - considere migrar para as versões protegidas

http://localhost:3210/utilizador/filter?status=true

router.use(authenticateToken);

router.get('/:table', getAll);//200 correct
router.get('/:table/filter', validateColumn, getFilteredData);//200 correct ?column=valor&other_column=othervalue
router.get('/:table/:id', validateId, getOne);//200 correct
router.post('/:table', validateBody, createRow);//201 correct
router.put('/:table/:id', validateId, validateBody, checkNotf, updateRow);//200 correct
router.delete('/:table/:id', validateId, checkNotf, deleteRow);//204 correct

module.exports = router;