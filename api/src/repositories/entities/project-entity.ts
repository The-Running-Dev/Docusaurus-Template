import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'projects' })
export class ProjectEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  category!: string;

  @Column('text')
  subCategory!: string;

  @Column('text')
  slug!: string;

  @Column('text')
  title!: string;

  @Column('text', { nullable: true })
  link?: string;

  @Column('text')
  summary!: string;

  @Column('simple-array')
  tags!: string[];

  @Column({ type: 'text', nullable: true })
  lastModified?: Date;

  @Column('text', { nullable: true })
  repoUrl?: string;

  @Column({ type: 'integer', nullable: true })
  stars?: number;

  @Column({ type: 'integer', nullable: true })
  forks?: number;

  @Column('text', { nullable: true })
  language?: string;

  @Column({ type: 'integer', nullable: true })
  size?: number;

  @Column({ type: 'text', nullable: true })
  lastCommit?: Date;

  @Column({ type: 'integer', nullable: true })
  openIssues?: number;

  @Column({ type: 'text', nullable: true })
  lastSyncedAt?: Date;

  @Column('boolean', { default: true })
  syncEnabled!: boolean;

  @Column('text', { default: 'daily' })
  syncInterval!: 'daily' | 'weekly' | 'disabled';
}
