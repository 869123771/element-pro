import {home_zh_cn} from './modules/home'
import {common_zh_cn} from './modules/common'
import {system_user_zh_cn} from './modules/system/user'
import {system_dict_zh_cn} from './modules/system/dict'
import {system_dict_category_zh_cn} from './modules/system/dict_category'
import {system_role_zh_cn} from './modules/system/role'
export default {
    ...home_zh_cn,
    ...common_zh_cn,
    ...system_user_zh_cn,
    ...system_dict_zh_cn,
    ...system_dict_category_zh_cn,
    ...system_role_zh_cn,
}
