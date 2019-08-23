import {home_zh_tw} from './modules/home'
import {common_zh_tw} from './modules/common'
import {system_user_zh_tw} from './modules/system/user'
import {system_dict_zh_tw} from './modules/system/dict'
import {system_dict_category_zh_tw} from './modules/system/dict_category'
import {system_role_zh_tw} from './modules/system/role'

export default {
    ...home_zh_tw,
    ...common_zh_tw,
    ...system_user_zh_tw,
    ...system_dict_zh_tw,
    ...system_dict_category_zh_tw,
    ...system_role_zh_tw
}
