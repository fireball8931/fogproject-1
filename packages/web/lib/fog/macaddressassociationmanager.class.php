<?php
/**
 * MAC association manager mass management class.
 *
 * PHP version 5
 *
 * @category MACAddressAssociationManager
 * @package  FOGProject
 * @author   Tom Elliott <tommygunsster@gmail.com>
 * @license  http://opensource.org/licenses/gpl-3.0 GPLv3
 * @link     https://fogproject.org
 */
/**
 * MAC association manager mass management class.
 *
 * @category MACAddressAssociationManager
 * @package  FOGProject
 * @author   Tom Elliott <tommygunsster@gmail.com>
 * @license  http://opensource.org/licenses/gpl-3.0 GPLv3
 * @link     https://fogproject.org
 */
class MACAddressAssociationManager extends FOGManagerController
{
    /**
     * Install our table.
     *
     * @return bool
     */
    public function install()
    {
        $sql = Schema::createTable(
            'hostMAC',
            true,
            array(
                'hmID',
                'hmHostID',
                'hmMAC',
                'hmDesc',
                'hmPrimary',
                'hmPending',
                'hmIgnoreClient',
                'hmIgnoreImaging'
            ),
            array(
                'INTEGER',
                'INTEGER',
                'VARCHAR(17)',
                'LONGTEXT',
                "ENUM('0', '1')",
                "ENUM('0', '1')",
                "ENUM('0', '1')",
                "ENUM('0', '1')"
            ),
            array(
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ),
            array(
                false,
                false,
                false,
                false,
                false,
                '0',
                '0',
                '0'
            ),
            array(
                array(
                    'hmMAC',
                    'hmHostID'
                )
            ),
            'MyISAM',
            'utf8',
            'hmID',
            'hmID'
        );
    }
    /**
     * Uninstalls the table.
     *
     * @return bool
     */
    public function uninstall()
    {
        $sql = Schema::dropTable('hostMAC');
        return self::$DB->query($sql);
    }
}
