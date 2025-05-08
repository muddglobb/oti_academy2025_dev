import { PackageService } from '../services/package.service.js';
import { asyncHandler } from '../middlewares/async.middleware.js';
import { ApiResponse } from '../utils/api-response.js';

// @desc    Membuat package baru
// @route   POST /packages
// @access  Public
export const createPackage = asyncHandler(async (req, res) => {
  const { name, type, price } = req.body;
  
  // Validasi input dasar
  if (!name || !type || price === undefined) {
    return res.status(400).json(
      ApiResponse.error('Nama, tipe, dan harga package wajib diisi')
    );
  }
  
  // Validasi tipe package
  const validTypes = ['ENTRY', 'INTERMEDIATE', 'BUNDLE'];
  if (!validTypes.includes(type)) {
    return res.status(400).json(
      ApiResponse.error(`Tipe package tidak valid. Pilih salah satu dari: ${validTypes.join(', ')}`)
    );
  }
  
  const package_ = await PackageService.createPackage({
    name,
    type,
    price: Number(price)
  });
  
  res.status(201).json(
    ApiResponse.success(package_, 'Package berhasil dibuat')
  );
});

// @desc    Mendapatkan semua package
// @route   GET /packages
// @access  Public
export const getAllPackages = asyncHandler(async (req, res) => {
  const packages = await PackageService.getAllPackages();
  
  res.status(200).json(
    ApiResponse.success(packages)
  );
});

// @desc    Mendapatkan package berdasarkan ID
// @route   GET /packages/:id
// @access  Public
export const getPackageById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const package_ = await PackageService.getPackageById(id);
  
  if (!package_) {
    return res.status(404).json(
      ApiResponse.error('Package tidak ditemukan')
    );
  }
  
  res.status(200).json(
    ApiResponse.success(package_)
  );
});

// @desc    Memperbarui package berdasarkan ID
// @route   PUT /packages/:id
// @access  Public
export const updatePackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, type, price } = req.body;
  
  // Check if package exists
  const existingPackage = await PackageService.getPackageById(id);
  if (!existingPackage) {
    return res.status(404).json(
      ApiResponse.error('Package tidak ditemukan')
    );
  }
  
  // Validasi tipe package jika disediakan
  if (type) {
    const validTypes = ['ENTRY', 'INTERMEDIATE', 'BUNDLE'];
    if (!validTypes.includes(type)) {
      return res.status(400).json(
        ApiResponse.error(`Tipe package tidak valid. Pilih salah satu dari: ${validTypes.join(', ')}`)
      );
    }
  }
  
  // Prepare update data
  const updateData = {};
  if (name) updateData.name = name;
  if (type) updateData.type = type;
  if (price !== undefined) updateData.price = Number(price);
  
  const updatedPackage = await PackageService.updatePackage(id, updateData);
  
  res.status(200).json(
    ApiResponse.success(updatedPackage, 'Package berhasil diperbarui')
  );
});

// @desc    Menghapus package berdasarkan ID
// @route   DELETE /packages/:id
// @access  Public
export const deletePackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Check if package exists
  const existingPackage = await PackageService.getPackageById(id);
  if (!existingPackage) {
    return res.status(404).json(
      ApiResponse.error('Package tidak ditemukan')
    );
  }
  
  await PackageService.deletePackage(id);
  
  res.status(200).json(
    ApiResponse.success(null, 'Package berhasil dihapus')
  );
});