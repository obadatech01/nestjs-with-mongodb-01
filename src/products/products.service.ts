/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {
    
  }

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.productModel({title, description: desc, price});
    const result = await newProduct.save();
    return result.id as string;
  }

  async getProducts() {
    const products = await this.productModel.find();
    return products;
  }

  async getProduct(id: string) {
    const product = await this.findProduct(id);
    return {id: product.id, title: product.title, description: product.description, price: product.price};
  }

  async updateProduct(productId: string, title: string, desc: string, price: number) {
    const updateProduct = await this.findProduct(productId);
    if(title) {
      updateProduct.title = title;
    }
    if(desc) {
      updateProduct.description = desc;
    }
    if(price) {
      updateProduct.price = price;
    }

    updateProduct.save();
  }

  async deleteProduct(id: string) {
    await this.productModel.deleteOne({_id: id}).exec();
  }

  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id);      
    } catch (err) {
      throw new NotFoundException('Could not find product.');      
    }
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return product;
  }
}
