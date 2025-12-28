import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'series' })
export class SeriesEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity({ name: 'series-metadata' })
export class SeriesMetadataEntity {
  @PrimaryColumn()
  series_id: string;
  @Column()
  title: string;
  @Column()
  type: string;
  @Column()
  year: string;
  @Column('text', { array: true })
  genres: string[];
  @Column({ type: 'decimal' })
  bayesian_rating: number;
  @Column()
  original: string;
  @Column()
  thumb: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
