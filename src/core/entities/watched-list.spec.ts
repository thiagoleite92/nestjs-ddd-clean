import { WatchedList } from './watched-list'

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

let list: NumberWatchedList

describe('Watched List', () => {
  beforeEach(() => {
    list = new NumberWatchedList([1, 2, 3])
  })

  it('should be able to create a wachtedList with initial items', () => {
    expect(list.currentItems).toHaveLength(3)
  })

  it('should be able to add new items to the list', () => {
    list.add(4)

    expect(list.currentItems).toHaveLength(4)
    expect(list.getNewItems()).toEqual([4])
  })

  it('should be able to remove items from the list', () => {
    list.remove(1)

    expect(list.currentItems).toHaveLength(2)
    expect(list.getRemovedItems()).toEqual([1])
  })

  it('should be able add an item, even if it was removed before', () => {
    list.remove(2)
    list.add(2)

    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able remove an item, even if it was added before', () => {
    list.add(4)
    list.remove(4)

    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([])
    expect(list.getNewItems()).toEqual([])
  })

  it('should be able to update watched list items', () => {
    list.update([1, 3, 5])

    expect(list.currentItems).toHaveLength(3)
    expect(list.getRemovedItems()).toEqual([2])
    expect(list.getNewItems()).toEqual([5])
  })
})
