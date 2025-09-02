import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'projects' })
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  category!: string;

  @Column()
  subCategory!: string;

  @Column()
  slug!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  link?: string;

  @Column('text')
  summary!: string;

  @Column('simple-array')
  tags!: string[];

  @Column({ type: 'datetime', nullable: true })
  lastModified?: Date;

  @Column({ nullable: true })
  repoUrl?: string;

  @Column({ type: 'int', nullable: true })
  stars?: number;

  @Column({ type: 'int', nullable: true })
  forks?: number;

  @Column({ nullable: true })
  language?: string;

  @Column({ type: 'int', nullable: true })
  size?: number;

  @Column({ type: 'datetime', nullable: true })
  lastCommit?: Date;

  @Column({ type: 'int', nullable: true })
  openIssues?: number;

  @Column({ type: 'datetime', nullable: true })
  lastSyncedAt?: Date;

  @Column({ default: true })
  syncEnabled!: boolean;

  @Column({ default: 'daily' })
  syncInterval!: 'daily' | 'weekly' | 'disabled';
}
