import { body, param } from 'express-validator';

export const validateChico = [
  body('dni')
    .isLength({ min: 7, max: 8 })
    .isNumeric()
    .withMessage('DNI must be 7-8 digits'),
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters'),
  body('apellido')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Lastname must be 2-50 characters'),
  body('edad')
    .isInt({ min: 3, max: 18 })
    .withMessage('Age must be between 3 and 18')
];

export const validateMicro = [
  body('patente')
    .trim()
    .isLength({ min: 6, max: 7 })
    .matches(/^[A-Z]{3}[0-9]{3,4}$/)
    .withMessage('Invalid patente format'),
  body('modelo')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Model must be 2-50 characters'),
  body('capacidad')
    .isInt({ min: 10, max: 50 })
    .withMessage('Capacity must be between 10 and 50')
];

export const validateChofer = [
  body('dni')
    .isLength({ min: 7, max: 8 })
    .isNumeric()
    .withMessage('DNI must be 7-8 digits'),
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters'),
  body('apellido')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Lastname must be 2-50 characters'),
  body('licencia')
    .trim()
    .isLength({ min: 8, max: 10 })
    .withMessage('License must be 8-10 characters')
];

export const validateDni = [
  param('dni')
    .isLength({ min: 7, max: 8 })
    .isNumeric()
    .withMessage('DNI must be 7-8 digits')
];

export const validatePatente = [
  param('patente')
    .trim()
    .isLength({ min: 6, max: 7 })
    .matches(/^[A-Z]{3}[0-9]{3,4}$/)
    .withMessage('Invalid patente format')
];