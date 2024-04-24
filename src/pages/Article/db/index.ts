import Dexie, { Table } from 'dexie'



export interface IImgFile {
    id?: number
    name: string
    articleID: string
    data: File
}

class MyDbDexie extends Dexie {
    imgs!: Table<IImgFile>

    constructor() {
        super('imgFileDatabase')
        this.version(1).stores({
            imgs: '++id, &name, articleID, data'
        })
    }

    generateName(now: number, index?: number) {
        return '__imgs_' + now + '-' + Math.floor(Math.random() * 1000) + (typeof index === 'number' ? index : '')
    }

    async addAnImg(file: File, articleID: string) {
        const name = this.generateName(Date.now())
        await this.imgs.add({ name, articleID, data: file })
        return name
    }

    async addImgs(files: File[], articleID: string) {
        const now = Date.now()
        const names = Array(files.length).fill(0).map((_, index) => this.generateName(now, index))
        await this.imgs.bulkAdd(files.map((file, index) => ({
            name: names[index],
            articleID,
            data: file
        })))
        return names
    }

    async deleteAnImg(name: string) {
        const data = await this.getAnImg(name)
        await this.imgs.delete(data?.id)
    }

    async deleteImgs({ articleID, names }: Parameters<typeof this.getImgs>[0]) {
        const datas = await this.getImgs({ articleID, names })
        await this.imgs.bulkDelete(datas.map(i => i?.id))
    }

    getImgs({ articleID, names }: { articleID?: string, names?: string[] }) {
        if (articleID && names)
            return this.imgs.where('name').anyOfIgnoreCase().and(x => x.articleID === articleID).toArray()
        else if (articleID)
            return this.imgs.where('articleID').equalsIgnoreCase(articleID).toArray()
        else if(names)
            return this.imgs.where('name').anyOfIgnoreCase(names).toArray()
        else
            return Promise.resolve([])
    }

    getAnImg(name: string) {
        return this.imgs.get({ name })
    }
}

export const db = new MyDbDexie()


