import {
  describe,
  beforeAll,
  beforeEach,
  it,
  afterAll,
  afterEach,
  expect,
} from "bun:test";
import { sql } from "kysely";

import * as PersonRepository from "./person-repository";
import { db } from "./database";

describe("person-repository", () => {
  beforeEach(async () => {
    await db
      .insertInto("person")
      .values({
        id: 123,
        first_name: "Arnold",
        last_name: "Schwarzenegger",
        gender: "other",
      })
      .executeTakeFirstOrThrow();
  });

  beforeAll(async () => {
    await db.schema
      .createTable("person")
      .addColumn("id", "integer", (cb) =>
        cb.primaryKey().autoIncrement().notNull()
      )
      .addColumn("first_name", "varchar(255)", (cb) => cb.notNull())
      .addColumn("last_name", "varchar(255)")
      .addColumn("gender", "varchar(50)", (cb) => cb.notNull())
      .addColumn("created_at", "timestamp", (cb) =>
        cb.notNull().defaultTo(sql`current_timestamp`)
      )
      .execute();
  });

  afterEach(async () => {
    await sql`delete from ${sql.table("person")}`.execute(db);
  });

  afterAll(async () => {
    await db.schema.dropTable("person").execute();
  });

  it("should find a person with a given id", async () => {
    expect(await PersonRepository.findPersonById(123)).toMatchObject({
      id: 123,
      first_name: "Arnold",
      last_name: "Schwarzenegger",
      gender: "other",
    });
  });

  it("should find all people named Arnold", async () => {
    const people = await PersonRepository.findPeople({ first_name: "Arnold" });

    expect(people).toHaveLength(1);
    expect(people[0]).toMatchObject({
      id: 123,
      first_name: "Arnold",
      last_name: "Schwarzenegger",
      gender: "other",
    });
  });

  it("should update gender of a person with a given id", async () => {
    await PersonRepository.updatePerson(123, { gender: "woman" });

    expect(await PersonRepository.findPersonById(123)).toMatchObject({
      id: 123,
      first_name: "Arnold",
      last_name: "Schwarzenegger",
      gender: "woman",
    });
  });

  it("should create a person", async () => {
    await PersonRepository.createPerson({
      first_name: "Jennifer",
      last_name: "Aniston",
      gender: "woman",
    });

    expect(
      await PersonRepository.findPeople({ first_name: "Jennifer" })
    ).toHaveLength(1);
  });

  it("should delete a person with a given id", async () => {
    await PersonRepository.deletePerson(123);

    expect(await PersonRepository.findPersonById(123)).toBeUndefined();
  });
});
