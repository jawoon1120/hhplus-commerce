export abstract class DataMapper<Domain, Entity> {
  abstract toDomain(entity: Entity): Domain;
  abstract toEntity(domain: Domain): Entity;
}
