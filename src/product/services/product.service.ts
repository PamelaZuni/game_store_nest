import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, ILike, Repository } from "typeorm";
import { Product } from "../entities/product.entity";
import { CategoryService } from "../../category/services/category.service";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private categoryService: CategoryService
    ) { }

    async findAll(): Promise<Product[]> {
        return await this.productRepository.find({
            relations:{
                category: true
            }
        });
    }

    async findById(id: number): Promise<Product> {

        let product = await this.productRepository.findOne({
            where: {
                id
            },
            relations:{
                category: true
            }
        });

        if (!product)
            throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);

        return product;
    }

    async findByTitulo(titulo: string): Promise<Product[]> {
        return await this.productRepository.find({
            where:{
                titulo: ILike(`%${titulo}%`)
            },
            relations:{
                category: true
            }
        })
   }

   async create(product: Product): Promise<Product> {

    if (product.category){
            
        let category = await this.categoryService.findById(product.category.id)

        if (!category)
            throw new HttpException('Category not Founf!', HttpStatus.NOT_FOUND);
        
        return await this.productRepository.save(product);

    }
        return await this.productRepository.save(product);
    }

  async update(product: Product): Promise<Product> {
        
        let buscaProduct = await this.findById(product.id);

        if (!buscaProduct || !product.id)
            throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);

        if (product.category){
            
            let category = await this.categoryService.findById(product.category.id)
                
            if (!category)
                throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);
                
            return await this.productRepository.save(product);
        }
        
        return await this.productRepository.save(product);
    }

    async delete(id: number): Promise<DeleteResult> {
        
        let buscaProduct = await this.findById(id);

        if (!buscaProduct)
            throw new HttpException('Product not found!', HttpStatus.NOT_FOUND);

        return await this.productRepository.delete(id);

    }

}