import { IsNotEmpty } from "class-validator"
import { Category } from "src/category/entities/category.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity({name: "tb_products"})
export class Product {

    @PrimaryGeneratedColumn()    
    id: number

    @IsNotEmpty()
    @Column({length: 100, nullable: false})
    titulo: string

    @IsNotEmpty()
    @Column({length: 1000, nullable: false})
    texto: string

    @UpdateDateColumn()
    data: Date

    @ManyToOne(() => Category, (category) => category.product, {
        onDelete: "CASCADE"
    })
    category: Category

    
}

