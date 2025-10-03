import LocalStorageDS from '../impl/ds/LocalStorageDS'
import DataRepoImpl from '../impl/repo/DataRepoImpl'

const LS = new LocalStorageDS()
export const DataRepo = new DataRepoImpl(LS)


