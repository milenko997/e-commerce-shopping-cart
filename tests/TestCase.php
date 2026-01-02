<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use \Illuminate\Foundation\Testing\RefreshDatabase;
    use \Illuminate\Foundation\Testing\WithFaker;

    /**
     * Setup the test environment.
     */
    public function setUp(): void
    {
        parent::setUp();
    }
}
